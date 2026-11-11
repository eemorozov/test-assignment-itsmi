import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Skill } from '@prisma/client';

/**
 * Repository layer for database operations on the `skills` table.
 * Encapsulates direct PrismaClient calls away from services and resolvers.
 */
@Injectable()
export class SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all skills associated with the specified profile IDs,
   * sorted deterministically by sortOrder ascending.
   *
   * @param profileIds List of profile UUIDs to fetch skills for
   * @returns Array of skills matching the given profile IDs
   */
  async findByProfileIds(profileIds: readonly string[]): Promise<Skill[]> {
    return this.prisma.skill.findMany({
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
   * Finds all skills for a single profile ID.
   *
   * @param profileId Profile identifier
   * @returns Array of skills
   */
  async findByProfileId(profileId: string): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
