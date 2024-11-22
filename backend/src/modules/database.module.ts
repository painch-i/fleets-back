import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/read-database/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
