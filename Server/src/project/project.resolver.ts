// project.resolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { Project } from 'src/user/entity/project.entity';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  // Mutation to create a project
  @Mutation(() => Project)
  @UseGuards(JwtGuard, new RoleGuard(Roles.MANAGER)) // Only Manager role can access this
  async createProject(
    @Args('name') name: string,
    @Context('user') user: any, // The user object will be set by JwtGuard
  ): Promise<Project> {
    return this.projectService.createProject(name, user.id);
  }
}
