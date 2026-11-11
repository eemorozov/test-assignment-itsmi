import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service managing the Prisma Client lifecycle.
 *
 * Implements OnModuleInit and OnModuleDestroy to ensure proper connection
 * opening and graceful teardown during application restarts.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Connect to the PostgreSQL database when the module initializes.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL database.');
    } catch (error) {
      this.logger.error('Failed to connect to database during onModuleInit', error);
      // Let the error propagate or handle gracefully
      throw error;
    }
  }

  /**
   * Disconnect from PostgreSQL when the module is destroyed.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database connection disconnected cleanly.');
  }
}
