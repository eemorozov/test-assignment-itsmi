import { Module } from '@nestjs/common';
import { SkillRepository } from './skill.repository';
import { SkillLoader } from './skill.loader';
import { SkillService } from './skill.service';

/**
 * Skill module encapsulating skill repository, request-scoped loader, and domain service.
 */
@Module({
  providers: [SkillRepository, SkillLoader, SkillService],
  exports: [SkillLoader, SkillService],
})
export class SkillModule {}
