import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { Project } from './entity/project.entity';
import { Bug } from './entity/bug.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Bug])],
  controllers: [],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
