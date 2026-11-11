import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseInitService } from './database-init.service';

/**
 * Global database module providing PrismaService across all application modules.
 */
@Global()
@Module({
  providers: [PrismaService, DatabaseInitService],
  exports: [PrismaService],
})
export class DatabaseModule {}
