import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/user/entity/project.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // Create project (only for managers)
  async createProject(name: string, managerId: number): Promise<Project> {
    const manager = await this.userRepo.findOne({ where: { id: managerId } });

    if (!manager || manager.role !== 'manager') {
      throw new Error('Only managers can create projects');
    }

    const project = this.projectRepo.create({
      name,
      manager,
    });

    return this.projectRepo.save(project);
  }
}
