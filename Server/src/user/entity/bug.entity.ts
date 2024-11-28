import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Field, ObjectType } from '@nestjs/graphql'; // Importing decorators

@Entity('bugs')
@Unique(['title', 'project'])
@ObjectType() // Make sure Bug is treated as a GraphQL object type
export class Bug {
  @PrimaryGeneratedColumn()
  @Field() // Expose the field to GraphQL
  id: number;

  @Column()
  @Field() // Expose the field to GraphQL
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true }) // Nullable in GraphQL
  description: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  screenshot: string;

  @Column({ type: 'enum', enum: ['feature', 'bug'] })
  @Field() // Expose the field to GraphQL
  type: string;

  @Column({ type: 'enum', enum: ['new', 'started', 'completed', 'resolved'] })
  @Field() // Expose the field to GraphQL
  status: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deadline: Date;

  @ManyToOne(() => User, (user) => user.createdBugs)
  @Field(() => User) // Specify the type of the related field
  creator: User;

  @ManyToOne(() => User, (user) => user.assignedBugs, { nullable: true })
  @Field(() => User, { nullable: true }) // Specify the type of the related field and make it nullable
  developer: User;

  @ManyToOne(() => Project, (project) => project.bugs, { nullable: false })
  @Field(() => Project) // Specify the type of the related field
  project: Project;
}
