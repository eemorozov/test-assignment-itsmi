import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { Profile } from '@prisma/client';

/**
 * Service managing profile business logic.
 * Encapsulates domain operations and keeps singleton scope decoupled from request-scoped loaders.
 */
@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  /**
   * Retrieves the main active digital business card profile.
   * Throws NotFoundException if no profile has been seeded yet.
   */
  async getMainProfile(): Promise<Profile> {
    const profile = await this.profileRepository.findMainProfile();
    if (!profile) {
      throw new NotFoundException(
        'Profile not found. Please ensure database seed has completed.',
      );
    }
    return profile;
  }
}
