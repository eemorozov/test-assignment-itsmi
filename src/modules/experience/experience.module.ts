import { Module } from '@nestjs/common';
import { ExperienceRepository } from './experience.repository';
import { ExperienceLoader } from './experience.loader';
import { ExperienceService } from './experience.service';

/**
 * Experience module providing data access and loaders for career records.
 */
@Module({
  providers: [ExperienceRepository, ExperienceLoader, ExperienceService],
  exports: [ExperienceLoader, ExperienceService],
})
export class ExperienceModule {}
