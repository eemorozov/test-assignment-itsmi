import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ProfileRepository } from './profile.repository';
import { SocialLink } from '@prisma/client';

/**
 * Request-scoped DataLoader responsible for batching and caching SocialLink resolution.
 *
 * Scoped to REQUEST to prevent cross-request cache leaks and eliminate N+1 queries.
 */
@Injectable({ scope: Scope.REQUEST })
export class SocialLinkLoader {
  private readonly loader: DataLoader<string, SocialLink[]>;

  constructor(private readonly profileRepository: ProfileRepository) {
    this.loader = new DataLoader<string, SocialLink[]>(
      async (profileIds: readonly string[]) => {
        const links =
          await this.profileRepository.findSocialLinksByProfileIds(profileIds);

        // Group links by profileId
        const linkMap = new Map<string, SocialLink[]>();
        for (const link of links) {
          const group = linkMap.get(link.profileId) ?? [];
          group.push(link);
          linkMap.set(link.profileId, group);
        }

        // Map back preserving input profileIds ordering, defaulting to empty list
        return profileIds.map((id) => linkMap.get(id) ?? []);
      },
    );
  }

  /**
   * Loads all social links for a specific profileId using the batching mechanism.
   *
   * @param profileId Profile identifier
   * @returns Promise resolving to an array of social links
   */
  async loadByProfileId(profileId: string): Promise<SocialLink[]> {
    return this.loader.load(profileId);
  }
}
