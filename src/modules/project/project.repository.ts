import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Project } from '@prisma/client';

/**
 * Repository layer for database operations on the `projects` table.
 * Encapsulates direct PrismaClient calls away from services and resolvers.
 */
@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all projects for the given profile IDs,
   * sorted deterministically by sortOrder ascending.
   *
   * @param profileIds List of profile UUIDs
   * @returns Array of project records
   */
  async findByProfileIds(profileIds: readonly string[]): Promise<Project[]> {
    return this.prisma.project.findMany({
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
   * Finds all projects for a single profile.
   *
   * @param profileId Profile identifier
   * @returns Array of project records
   */
  async findByProfileId(profileId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
