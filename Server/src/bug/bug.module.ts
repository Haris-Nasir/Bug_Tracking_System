// bug.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BugService } from './bug.service';
import { UserModule } from 'src/user/user.module'; // Import UserModule
import { ProjectModule } from 'src/project/project.module'; // Import ProjectModule
import { Bug } from 'src/user/entity/bug.entity';
import { BugResolver } from './bug.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Bug]), UserModule, ProjectModule], // Import necessary modules
  providers: [BugService, BugResolver], // Register services and resolvers
  exports: [BugService], // Export the service for usage in other modules
})
export class BugModule {}
