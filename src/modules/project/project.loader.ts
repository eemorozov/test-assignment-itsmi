import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ProjectRepository } from './project.repository';
import { Project } from '@prisma/client';

/**
 * Request-scoped DataLoader responsible for batching and caching Project resolution.
 *
 * Scoped to REQUEST to isolate caches per query execution and eliminate N+1 queries.
 */
@Injectable({ scope: Scope.REQUEST })
export class ProjectLoader {
  private readonly loader: DataLoader<string, Project[]>;

  constructor(private readonly projectRepository: ProjectRepository) {
    this.loader = new DataLoader<string, Project[]>(
      async (profileIds: readonly string[]) => {
        const projects =
          await this.projectRepository.findByProfileIds(profileIds);

        // Group projects by profileId
        const projectMap = new Map<string, Project[]>();
        for (const prj of projects) {
          const group = projectMap.get(prj.profileId) ?? [];
          group.push(prj);
          projectMap.set(prj.profileId, group);
        }

        // Map back preserving original profileIds order, defaulting to empty list
        return profileIds.map((id) => projectMap.get(id) ?? []);
      },
    );
  }

  /**
   * Loads all projects for a specific profileId using the batching mechanism.
   *
   * @param profileId Profile identifier
   * @returns Promise resolving to an array of projects
   */
  async loadByProfileId(profileId: string): Promise<Project[]> {
    return this.loader.load(profileId);
  }
}
