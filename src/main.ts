import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables from .env file if available
dotenv.config();

/**
 * Bootstrap function initializing the NestJS application.
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable graceful shutdown hooks for clean database disconnections
  app.enableShutdownHooks();

  // Enable Cross-Origin Resource Sharing for Apollo Sandbox web client
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: false,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`================================================================`);
  logger.log(`Evgeny Morozov Digital Business Card API is running!`);
  logger.log(`Apollo Sandbox GraphQL: http://localhost:${port}/graphql`);
  logger.log(`Healthcheck Endpoint:   http://localhost:${port}/health`);
  logger.log(`================================================================`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Fatal error during application bootstrap:', error);
  process.exit(1);
});
