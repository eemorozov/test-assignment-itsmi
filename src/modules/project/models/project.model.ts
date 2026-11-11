import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL object model representing a portfolio or open-source project.
 */
@ObjectType({ description: 'Featured or open-source project record' })
export class ProjectModel {
  @Field(() => ID, { description: 'Unique project identifier' })
  id!: string;

  @Field(() => String, { description: 'Project name' })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Detailed description of the project purpose and architectural design',
  })
  description?: string | null;

  @Field(() => String, { description: 'URL link to repository or live application' })
  url!: string;

  @Field(() => [String], {
    description: 'Technologies and frameworks used in the project',
  })
  techStack!: string[];

  @Field(() => Int, { description: 'Deterministic display sort order' })
  sortOrder!: number;

  profileId!: string;
}
