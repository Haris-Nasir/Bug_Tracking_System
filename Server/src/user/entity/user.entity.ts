import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Bug } from './bug.entity';
import { Project } from './project.entity'; // Import Project entity
import { ObjectType, Field } from '@nestjs/graphql'; // Importing GraphQL decorators

@Entity('users')
@ObjectType() // Make sure User is treated as a GraphQL object type
export class User {
  @PrimaryGeneratedColumn()
  @Field() // Expose the field to GraphQL
  id: number;

  @Column()
  @Field() // Expose the field to GraphQL
  name: string;

  @Column()
  @Field() // Expose the field to GraphQL
  email: string;

  @Column()
  @Field() // Expose the field to GraphQL
  password: string;

  @Column({ length: 50, default: 'user' })
  @Field()
  role: string;

  @OneToMany(() => Bug, (bug) => bug.creator)
  @Field(() => [Bug]) // Expose the relationship field to GraphQL
  createdBugs: Bug[];

  @OneToMany(() => Bug, (bug) => bug.developer)
  @Field(() => [Bug], { nullable: true }) // Expose the relationship field to GraphQL
  assignedBugs: Bug[];

  // Define the managedProjects relationship
  @OneToMany(() => Project, (project) => project.manager)
  @Field(() => [Project], { nullable: true }) // Expose the relationship field to GraphQL
  managedProjects: Project[];

  // Define the projects relationship
  @ManyToMany(() => Project, (project) => project.members)
  @Field(() => [Project], { nullable: true }) // Expose the relationship field to GraphQL
  projects: Project[];
}
