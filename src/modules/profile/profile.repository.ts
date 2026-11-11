import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Profile, SocialLink } from '@prisma/client';

/**
 * Repository layer for database operations on the `profiles` and `social_links` tables.
 * Encapsulates direct PrismaClient calls away from services and resolvers.
 */
@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the main active digital business card profile.
   * Defaults to slug 'main' or falls back to the first available record.
   */
  async findMainProfile(): Promise<Profile | null> {
    const mainProfile = await this.prisma.profile.findUnique({
      where: { slug: 'main' },
    });

    if (mainProfile) {
      return mainProfile;
    }

    return this.prisma.profile.findFirst({
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Finds a profile by its primary key ID.
   *
   * @param id Profile UUID
   */
  async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieves all social links for the specified list of profile IDs,
   * sorted deterministically by sortOrder ascending.
   *
   * @param profileIds List of profile UUIDs
   * @returns Array of social link entities
   */
  async findSocialLinksByProfileIds(
    profileIds: readonly string[],
  ): Promise<SocialLink[]> {
    return this.prisma.socialLink.findMany({
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
   * Finds social links for a single profile ID, sorted by sortOrder ascending.
   *
   * @param profileId Profile identifier
   */
  async findSocialLinksByProfileId(profileId: string): Promise<SocialLink[]> {
    return this.prisma.socialLink.findMany({
      where: { profileId },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }
}
