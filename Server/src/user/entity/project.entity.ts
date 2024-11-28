import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity'; // Import User entity
import { Bug } from './bug.entity'; // Import Bug entity
import { ObjectType, Field } from '@nestjs/graphql';

@Entity('projects')
@ObjectType() // Make sure Project is treated as a GraphQL object type
export class Project {
  @PrimaryGeneratedColumn()
  @Field() // Expose the field to GraphQL
  id: number;

  @Column()
  @Field() // Expose the field to GraphQL
  name: string;

  @OneToMany(() => Bug, (bug) => bug.project) // One project can have many bugs
  @Field(() => [Bug]) // Expose the field to GraphQL
  bugs: Bug[]; // This is the 'bugs' field you're trying to reference in the Bug entity

  @ManyToOne(() => User, (user) => user.managedProjects)
  @Field(() => User) // Expose the field to GraphQL
  manager: User; // Represent the manager of the project

  @ManyToMany(() => User, (user) => user.projects)
  @Field(() => [User]) // Expose the field to GraphQL
  members: User[]; // Represent the users associated with the project
}
