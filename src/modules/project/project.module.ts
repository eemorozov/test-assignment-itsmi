import { Module } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { ProjectLoader } from './project.loader';
import { ProjectService } from './project.service';

/**
 * Project module providing repository and DataLoader access for portfolio records.
 */
@Module({
  providers: [ProjectRepository, ProjectLoader, ProjectService],
  exports: [ProjectLoader, ProjectService],
})
export class ProjectModule {}
