import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from './auth/auth.guard';
import { User } from './user/entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { JwtGuard } from './auth/jwt.guard';
import { RoleGuard, Roles } from './auth/role.guard';
@Resolver((of) => String) //Resolver returning string type
export class AppResolver {
  @Query((returns) => String)
  index(): string {
    return 'Nest Js Graphql Server';
  }
  @Query((returns) => String)
  @UseGuards(JwtGuard)
  securedResource(@Context('user') user: any): string {
    return 'This is secured data' + JSON.stringify(user);
  }
  @Query((returns) => String)
  @UseGuards(JwtGuard, new RoleGuard(Roles.ADMIN))
  securedDataForAdmin(@Context('user') user: any): string {
    return 'This is secured data for Admin' + JSON.stringify(user);
  }
  @Query((returns) => String)
  @UseGuards(JwtGuard, new RoleGuard(Roles.NORMAL_USER))
  securedDataForNormal_User(@Context('user') user: any): string {
    return 'This is secured data for Normal_User' + JSON.stringify(user);
  }
  //I have created a query which will return a string and this query will fetch two arguments email and password
  @Query((returns) => String)
  @UseGuards(AuthGuard)
  login(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
    @Context('user') user: User,
  ): string {
    let payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, 'key', { expiresIn: '60s' });
  }
}
