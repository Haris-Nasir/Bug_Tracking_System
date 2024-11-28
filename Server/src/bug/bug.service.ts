import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bug } from 'src/user/entity/bug.entity';
import { User } from 'src/user/entity/user.entity';
import { Project } from 'src/user/entity/project.entity';

@Injectable()
export class BugService {
  constructor(
    @InjectRepository(Bug) private readonly bugRepo: Repository<Bug>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async reportBug(
    title: string,
    description: string | undefined,
    projectId: number,
    creatorId: number,
    type: 'feature' | 'bug',
  ): Promise<Bug> {
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!creator || creator.role !== 'qa') {
      throw new ForbiddenException('Only QAs can report bugs');
    }

    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const bug = this.bugRepo.create({
      title,
      description,
      type,
      status: 'new',
      project,
      creator,
    });

    return this.bugRepo.save(bug);
  }

  async assignBug(bugId: number, developerId: number): Promise<Bug> {
    const bug = await this.bugRepo.findOne({
      where: { id: bugId },
      relations: ['developer', 'project'],
    });
    if (!bug) {
      throw new NotFoundException('Bug not found');
    }

    const developer = await this.userRepo.findOne({
      where: { id: developerId },
    });
    if (!developer || developer.role !== 'developer') {
      throw new ForbiddenException('Invalid developer');
    }

    bug.developer = developer;
    return this.bugRepo.save(bug);
  }

  async resolveBug(
    bugId: number,
    developerId: number,
    status: 'started' | 'completed' | 'resolved',
  ): Promise<Bug> {
    const bug = await this.bugRepo.findOne({
      where: { id: bugId },
      relations: ['developer'],
    });
    if (!bug) {
      throw new NotFoundException('Bug not found');
    }

    if (!bug.developer || bug.developer.id !== developerId) {
      throw new ForbiddenException(
        'Only the assigned developer can resolve this bug',
      );
    }

    bug.status = status;
    return this.bugRepo.save(bug);
  }
}
