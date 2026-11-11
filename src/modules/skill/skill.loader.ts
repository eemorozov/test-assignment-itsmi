import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { SkillRepository } from './skill.repository';
import { Skill } from '@prisma/client';

/**
 * Request-scoped DataLoader responsible for batching and caching Skill entity resolution.
 *
 * Scope.REQUEST ensures an isolated cache per incoming GraphQL request,
 * preventing memory leaks and cross-request state contamination while
 * eliminating the N+1 queries problem by collapsing batch calls into one query.
 */
@Injectable({ scope: Scope.REQUEST })
export class SkillLoader {
  private readonly loader: DataLoader<string, Skill[]>;

  constructor(private readonly skillRepository: SkillRepository) {
    // DataLoader batch function receives an array of profile IDs gathered within a single tick
    this.loader = new DataLoader<string, Skill[]>(
      async (profileIds: readonly string[]) => {
        const skills = await this.skillRepository.findByProfileIds(profileIds);

        // Group skills by profileId
        const skillsMap = new Map<string, Skill[]>();
        for (const skill of skills) {
          const group = skillsMap.get(skill.profileId) ?? [];
          group.push(skill);
          skillsMap.set(skill.profileId, group);
        }

        // Map back to maintain identical order of requested profileIds, defaulting to empty array
        return profileIds.map((id) => skillsMap.get(id) ?? []);
      },
    );
  }

  /**
   * Loads all skills for a specific profileId using the batching mechanism.
   *
   * @param profileId Profile identifier
   * @returns Promise resolving to an array of skills for this profile
   */
  async loadByProfileId(profileId: string): Promise<Skill[]> {
    return this.loader.load(profileId);
  }
}
