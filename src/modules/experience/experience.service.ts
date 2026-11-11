import { Injectable } from '@nestjs/common';
import { ExperienceRepository } from './experience.repository';
import { Experience } from '@prisma/client';

/**
 * Service managing experience business logic.
 * Encapsulates domain operations and keeps singleton scope decoupled from request-scoped loaders.
 */
@Injectable()
export class ExperienceService {
  constructor(
    private readonly experienceRepository: ExperienceRepository,
  ) {}

  /**
   * Directly queries all experience records for a profile.
   *
   * @param profileId Profile identifier
   */
  async findAllByProfileId(profileId: string): Promise<Experience[]> {
    return this.experienceRepository.findByProfileId(profileId);
  }
}
