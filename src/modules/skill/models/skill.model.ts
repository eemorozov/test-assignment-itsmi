import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL object model representing a technical or leadership skill.
 */
@ObjectType({ description: 'Technical or leadership skill of the professional' })
export class SkillModel {
  @Field(() => ID, { description: 'Unique skill identifier' })
  id!: string;

  @Field(() => String, { description: 'Name of the skill or technology' })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Category group (e.g. Core & Frontend, Architecture & Build, DevOps & Tooling)',
  })
  category?: string | null;

  @Field(() => Int, { description: 'Deterministic display sort order' })
  sortOrder!: number;

  profileId!: string;
}
