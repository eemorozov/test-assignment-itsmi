import { Injectable } from '@nestjs/common';
import { SkillRepository } from './skill.repository';
import { Skill } from '@prisma/client';

/**
 * Service managing skill business logic.
 * Encapsulates domain operations and keeps singleton scope decoupled from request-scoped loaders.
 */
@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  /**
   * Directly queries all skills for a specific profile without batching.
   *
   * @param profileId Profile identifier
   */
  async findAllByProfileId(profileId: string): Promise<Skill[]> {
    return this.skillRepository.findByProfileId(profileId);
  }
}
