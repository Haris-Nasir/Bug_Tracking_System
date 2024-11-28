// project.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { UserModule } from 'src/user/user.module'; // Import UserModule
import { Project } from 'src/user/entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), UserModule], // Make sure to import UserModule for user-related functionality
  providers: [ProjectService, ProjectResolver], // Register services and resolvers
  exports: [ProjectService], // Export the service for usage in other modules
})
export class ProjectModule {}
