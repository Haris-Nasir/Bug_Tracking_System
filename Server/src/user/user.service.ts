import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public readonly userRepo: Repository<User>,
  ) {}
  async findUserByEmail(email: string): Promise<User | undefined> {
    console.log('Finding user with email:', email);

    try {
      const user = await this.userRepo.findOne({ where: { email: email } });
      console.log('Query result:', user);
      return user;
    } catch (error) {
      console.error('Error while querying user by email:', error);
      throw error;
    }
  }
}
