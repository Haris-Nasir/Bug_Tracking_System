// auth.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module'; // Import UserModule
import { AuthGuard } from './auth.guard';
import { JwtGuard } from './jwt.guard';
import { RoleGuard } from './role.guard'; // Ensure RoleGuard is imported for use
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule], // Import JwtModule if you're using JWT for authorization
  providers: [AuthGuard, JwtGuard, RoleGuard], // Register guards as providers
  exports: [AuthGuard, JwtGuard, RoleGuard], // Export guards for use in other modules
})
export class AuthModule {}
