import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL object model representing a career position and work experience.
 */
@ObjectType({ description: 'Work experience and career record' })
export class ExperienceModel {
  @Field(() => ID, { description: 'Unique experience identifier' })
  id!: string;

  @Field(() => String, { description: 'Company or organization name' })
  company!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Brief description of company domain and product',
  })
  companyInfo?: string | null;

  @Field(() => String, { description: 'Role or job title' })
  position!: string;

  @Field(() => String, { description: 'Human-readable employment period' })
  period!: string;

  @Field(() => Date, { description: 'Employment start date' })
  startDate!: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Employment end date (null for present position)',
  })
  endDate?: Date | null;

  @Field(() => [String], {
    description: 'Key engineering achievements and project impacts',
  })
  achievements!: string[];

  @Field(() => [String], {
    description: 'Technologies and tools utilized during this role',
  })
  techStack!: string[];

  @Field(() => Int, { description: 'Deterministic display sort order' })
  sortOrder!: number;

  profileId!: string;
}
