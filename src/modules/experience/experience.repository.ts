import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Experience } from '@prisma/client';

/**
 * Repository layer for database operations on the `experiences` table.
 * Encapsulates direct PrismaClient calls away from services and resolvers.
 */
@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all experience records for the given profile IDs,
   * sorted deterministically by sortOrder ascending.
   *
   * @param profileIds List of profile UUIDs
   * @returns Array of experience records
   */
  async findByProfileIds(profileIds: readonly string[]): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: {
        profileId: {
          in: [...profileIds],
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  /**
   * Finds all experiences for a single profile.
   *
   * @param profileId Profile identifier
   * @returns Array of experience records
   */
  async findByProfileId(profileId: string): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
