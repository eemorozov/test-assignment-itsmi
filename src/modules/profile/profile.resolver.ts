import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ProfileModel } from './models/profile.model';
import { SocialLinkModel } from './models/social-link.model';
import { SkillModel } from '../skill/models/skill.model';
import { ExperienceModel } from '../experience/models/experience.model';
import { ProjectModel } from '../project/models/project.model';
import { ProfileService } from './profile.service';
import { SocialLinkLoader } from './social-link.loader';
import { SkillLoader } from '../skill/skill.loader';
import { ExperienceLoader } from '../experience/experience.loader';
import { ProjectLoader } from '../project/project.loader';

/**
 * GraphQL Resolver for the Profile aggregate root.
 *
 * Implements strict separation of concerns:
 * - Root query fetches ONLY the root Profile table without joins via singleton ProfileService
 * - Relations (links, skills, experience, projects) are resolved lazily via @ResolveField()
 * - All relation resolution directly utilizes Request-scoped DataLoaders to completely prevent N+1 queries
 */
@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly socialLinkLoader: SocialLinkLoader,
    private readonly skillLoader: SkillLoader,
    private readonly experienceLoader: ExperienceLoader,
    private readonly projectLoader: ProjectLoader,
  ) {}

  /**
   * Root GraphQL query fetching Evgeny Morozov's professional profile.
   * Executes a single O(1) query for the profile record without eager relational joins.
   */
  @Query(() => ProfileModel, {
    name: 'profile',
    description: 'Fetch the digital business card profile of Evgeny Morozov',
  })
  async getProfile(): Promise<ProfileModel> {
    return this.profileService.getMainProfile();
  }

  /**
   * Lazily resolves contact and social links via request-scoped DataLoader.
   * If not requested in the GraphQL selection set, zero SQL queries are made.
   */
  @ResolveField(() => [SocialLinkModel], {
    name: 'links',
    description: 'Professional social and contact channels resolved lazily with zero N+1 overhead',
  })
  async resolveLinks(
    @Parent() profile: ProfileModel,
  ): Promise<SocialLinkModel[]> {
    return this.socialLinkLoader.loadByProfileId(profile.id);
  }

  /**
   * Lazily resolves technical skills via request-scoped DataLoader.
   * Batches requests across identical ticks and filters by profile ID.
   */
  @ResolveField(() => [SkillModel], {
    name: 'skills',
    description: 'Technical and architectural skills resolved lazily with zero N+1 overhead',
  })
  async resolveSkills(@Parent() profile: ProfileModel): Promise<SkillModel[]> {
    return this.skillLoader.loadByProfileId(profile.id);
  }

  /**
   * Lazily resolves work experience records via request-scoped DataLoader.
   */
  @ResolveField(() => [ExperienceModel], {
    name: 'experience',
    description: 'Career positions and achievements resolved lazily with zero N+1 overhead',
  })
  async resolveExperience(
    @Parent() profile: ProfileModel,
  ): Promise<ExperienceModel[]> {
    return this.experienceLoader.loadByProfileId(profile.id);
  }

  /**
   * Lazily resolves portfolio projects via request-scoped DataLoader.
   */
  @ResolveField(() => [ProjectModel], {
    name: 'projects',
    description: 'Production and open-source projects resolved lazily with zero N+1 overhead',
  })
  async resolveProjects(
    @Parent() profile: ProfileModel,
  ): Promise<ProjectModel[]> {
    return this.projectLoader.loadByProfileId(profile.id);
  }
}
