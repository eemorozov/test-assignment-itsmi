import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { seedDatabase } from '../../prisma/seed';

/**
 * Service responsible for idempotent bootstrap data initialization.
 *
 * Ensures that upon application boot, the default profile and all related CV entities
 * exist in PostgreSQL without requiring manual seeding commands.
 */
@Injectable()
export class DatabaseInitService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Automatically executes idempotent database seeding on bootstrap if not already present.
   */
  async onApplicationBootstrap(): Promise<void> {
    try {
      const existingProfile = await this.prisma.profile.findUnique({
        where: { slug: 'main' },
        select: { id: true },
      });

      if (!existingProfile || process.env.FORCE_SEED === 'true') {
        this.logger.log('Seeding initial database state...');
        await seedDatabase(this.prisma);
        this.logger.log('Database seeded successfully.');
      } else {
        this.logger.log(
          'Database already initialized (skipping destructive re-seed). Set FORCE_SEED=true to force update.',
        );
      }
    } catch (error) {
      this.logger.error(
        'Failed to execute initial database seed on bootstrap. Verify database connectivity and schema.',
        error,
      );
    }
  }
}
