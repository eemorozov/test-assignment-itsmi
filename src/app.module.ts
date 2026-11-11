import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SkillModule } from './modules/skill/skill.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { ProjectModule } from './modules/project/project.module';
import { HealthController } from './common/health/health.controller';

/**
 * Root application module configuring Apollo GraphQL, Database, and Domain modules.
 */
@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      introspection: true,
      formatError: (formattedError) => ({
        message: formattedError.message,
        locations: formattedError.locations,
        path: formattedError.path,
        extensions: {
          code: formattedError.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
        },
      }),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          document: `query GetEvgenyMorozovProfile {
  profile {
    name
    title
    location
    description
    education
    languages
    links {
      platform
      url
    }
    skills {
      name
      category
    }
    experience {
      company
      companyInfo
      position
      period
      achievements
      techStack
    }
    projects {
      name
      description
      url
      techStack
    }
  }
}`,
        }),
      ],
    }),
    ProfileModule,
    SkillModule,
    ExperienceModule,
    ProjectModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
