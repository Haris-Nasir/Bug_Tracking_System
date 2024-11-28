import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { JwtGuard } from './auth/jwt.guard';
import { RoleGuard, Roles } from './auth/role.guard';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from './auth/auth.guard';
import { User } from './user/entity/user.entity';

@Resolver()
export class AppResolver {
  @Query(() => String)
  index(): string {
    return 'NestJS GraphQL Server';
  }

  @Query(() => String)
  @UseGuards(JwtGuard)
  securedResource(@Context('user') user: any): string {
    return `This is secured data for ${user.role}: ${JSON.stringify(user)}`;
  }

  @Query(() => String)
  @UseGuards(JwtGuard, new RoleGuard(Roles.MANAGER))
  securedDataForManager(@Context('user') user: any): string {
    return `This is secured data for Manager: ${JSON.stringify(user)}`;
  }

  @Query(() => String)
  @UseGuards(JwtGuard, new RoleGuard(Roles.DEVELOPER))
  securedDataForDeveloper(@Context('user') user: any): string {
    return `This is secured data for Developer: ${JSON.stringify(user)}`;
  }

  @Query(() => String)
  @UseGuards(JwtGuard, new RoleGuard(Roles.QA))
  securedDataForQA(@Context('user') user: any): string {
    return `This is secured data for QA: ${JSON.stringify(user)}`;
  }

  @Query((returns) => String)
  @UseGuards(AuthGuard)
  login(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
    @Context('user') user: User,
  ): string {
    let payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, 'key', { expiresIn: '30m' });
  }
}
