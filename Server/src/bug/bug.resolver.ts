import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BugService } from './bug.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { Bug } from 'src/user/entity/bug.entity';

@Resolver(() => Bug)
export class BugResolver {
  constructor(private readonly bugService: BugService) {}

  // Mutation to report a bug (Only QAs)
  @Mutation(() => Bug)
  @UseGuards(JwtGuard, new RoleGuard(Roles.QA)) // Only QA role can report a bug
  async reportBug(
    @Args('title') title: string,
    @Args('projectId') projectId: number, // Required parameter
    @Args('type') type: 'feature' | 'bug', // Required parameter
    @Context('user') user: any, // Required parameter - moved earlier
    @Args('description', { nullable: true }) description?: string, // Optional parameter - moved after required ones
  ): Promise<Bug> {
    return this.bugService.reportBug(
      title,
      description,
      projectId,
      user.id,
      type,
    );
  }

  // Mutation to assign a bug to a developer (Only developers can be assigned bugs)
  @Mutation(() => Bug)
  @UseGuards(JwtGuard, new RoleGuard(Roles.MANAGER)) // Manager assigns bugs
  async assignBug(
    @Args('bugId') bugId: number,
    @Args('developerId') developerId: number,
  ): Promise<Bug> {
    return this.bugService.assignBug(bugId, developerId);
  }

  // Mutation to resolve a bug (Only developers can resolve bugs)
  @Mutation(() => Bug)
  @UseGuards(JwtGuard, new RoleGuard(Roles.DEVELOPER)) // Only Developer role can resolve bugs
  async resolveBug(
    @Args('bugId') bugId: number,
    @Args('status') status: 'started' | 'completed' | 'resolved',
    @Context('user') user: any, // The user object will be set by JwtGuard
  ): Promise<Bug> {
    return this.bugService.resolveBug(bugId, user.id, status);
  }
}
