import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  // We will get graphql email and password variables through context, for this we will make gql execution context
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { email, password } = ctx.req.body.variables;
    console.log('Authenticating with email:', email, 'and password:', password);
    const user: User = await this.userService.findUserByEmail(email);
    console.log('Fetched User:', user);

    if (user && user.password == password) {
      console.log('Authentication successful for user:', user.email);
      ctx.user = user;
      return true;
    } else {
      console.error('Authentication failed. Invalid email or password.');
      throw new HttpException('UnAuthenticated', HttpStatus.UNAUTHORIZED);
    }
  }
}
