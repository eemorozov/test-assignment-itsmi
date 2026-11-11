import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SocialLinkModel } from './social-link.model';
import { SkillModel } from '../../skill/models/skill.model';
import { ExperienceModel } from '../../experience/models/experience.model';
import { ProjectModel } from '../../project/models/project.model';

/**
 * GraphQL object model representing the digital business card profile of the professional.
 */
@ObjectType({ description: 'Digital business card profile of the professional' })
export class ProfileModel {
  @Field(() => ID, { description: 'Unique profile identifier' })
  id!: string;

  slug!: string;

  @Field(() => String, { description: 'Full professional name' })
  name!: string;

  @Field(() => String, { description: 'Primary professional title and specializations' })
  title!: string;

  @Field(() => String, { description: 'Current location / residency' })
  location!: string;

  @Field(() => String, {
    description: 'Executive bio and professional summary highlighting key strengths',
  })
  description!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Higher education credentials and academic institutions',
  })
  education?: string | null;

  @Field(() => [String], {
    description: 'Languages spoken and corresponding proficiency levels',
  })
  languages!: string[];

  @Field(() => [SocialLinkModel], {
    description: 'Contact links, messenger handles, and online profiles',
  })
  links?: SocialLinkModel[];

  @Field(() => [SkillModel], {
    description: 'Categorized technical, architectural, and leadership skills',
  })
  skills?: SkillModel[];

  @Field(() => [ExperienceModel], {
    description: 'Chronological career history and key achievements',
  })
  experience?: ExperienceModel[];

  @Field(() => [ProjectModel], {
    description: 'Featured production and open-source software projects',
  })
  projects?: ProjectModel[];

  @Field(() => Date, { description: 'Record creation timestamp' })
  createdAt!: Date;

  @Field(() => Date, { description: 'Record last updated timestamp' })
  updatedAt!: Date;
}
