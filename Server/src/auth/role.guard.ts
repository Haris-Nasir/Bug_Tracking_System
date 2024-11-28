import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Roles = {
  MANAGER: 'manager',
  DEVELOPER: 'developer',
  QA: 'qa',
};

export class RoleGuard implements CanActivate {
  constructor(private readonly role: string) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { role } = ctx.user;

    return role === this.role; // Ensures the user role matches the required role.
  }
}
