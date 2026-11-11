import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL object model representing a social or contact communication channel.
 */
@ObjectType({ description: 'Contact and social link entry' })
export class SocialLinkModel {
  @Field(() => ID, { description: 'Unique social link identifier' })
  id!: string;

  @Field(() => String, {
    description: 'Platform name (e.g. LinkedIn, Telegram, Email, GitHub, Phone)',
  })
  platform!: string;

  @Field(() => String, { description: 'Direct URL or contact URI' })
  url!: string;

  @Field(() => Int, { description: 'Deterministic display sort order' })
  sortOrder!: number;

  profileId!: string;
}
