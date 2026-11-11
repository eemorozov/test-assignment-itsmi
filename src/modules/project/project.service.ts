import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { Project } from '@prisma/client';

/**
 * Service managing project business logic.
 * Encapsulates domain operations and keeps singleton scope decoupled from request-scoped loaders.
 */
@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
  ) {}

  /**
   * Directly queries all projects for a profile.
   *
   * @param profileId Profile identifier
   */
  async findAllByProfileId(profileId: string): Promise<Project[]> {
    return this.projectRepository.findByProfileId(profileId);
  }
}
