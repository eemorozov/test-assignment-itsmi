import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ExperienceRepository } from './experience.repository';
import { Experience } from '@prisma/client';

/**
 * Request-scoped DataLoader responsible for batching and caching Experience resolution.
 *
 * Scoped to REQUEST to maintain clean per-request isolation and eliminate N+1 database queries.
 */
@Injectable({ scope: Scope.REQUEST })
export class ExperienceLoader {
  private readonly loader: DataLoader<string, Experience[]>;

  constructor(private readonly experienceRepository: ExperienceRepository) {
    this.loader = new DataLoader<string, Experience[]>(
      async (profileIds: readonly string[]) => {
        const experiences =
          await this.experienceRepository.findByProfileIds(profileIds);

        // Group experiences by profileId
        const experienceMap = new Map<string, Experience[]>();
        for (const exp of experiences) {
          const group = experienceMap.get(exp.profileId) ?? [];
          group.push(exp);
          experienceMap.set(exp.profileId, group);
        }

        // Map back to preserve input profileIds ordering, defaulting to empty list
        return profileIds.map((id) => experienceMap.get(id) ?? []);
      },
    );
  }

  /**
   * Loads all experience records for a specific profileId using the batching mechanism.
   *
   * @param profileId Profile identifier
   * @returns Promise resolving to an array of experiences
   */
  async loadByProfileId(profileId: string): Promise<Experience[]> {
    return this.loader.load(profileId);
  }
}
