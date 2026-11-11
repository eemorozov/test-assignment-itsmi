import { Module } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { SocialLinkLoader } from './social-link.loader';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { SkillModule } from '../skill/skill.module';
import { ExperienceModule } from '../experience/experience.module';
import { ProjectModule } from '../project/project.module';

/**
 * Profile module orchestrating profile aggregate resolution,
 * relations, and GraphQL schema integration.
 */
@Module({
  imports: [SkillModule, ExperienceModule, ProjectModule],
  providers: [
    ProfileRepository,
    SocialLinkLoader,
    ProfileService,
    ProfileResolver,
  ],
  exports: [ProfileService, SocialLinkLoader],
})
export class ProfileModule {}
