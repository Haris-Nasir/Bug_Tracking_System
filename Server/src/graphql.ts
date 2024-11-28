
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Project {
    id: number;
    name: string;
    bugs: Bug[];
    manager: User;
    members: User[];
}

export interface Bug {
    id: number;
    title: string;
    description?: Nullable<string>;
    screenshot?: Nullable<string>;
    type: string;
    status: string;
    deadline?: Nullable<DateTime>;
    creator: User;
    developer?: Nullable<User>;
    project: Project;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    createdBugs: Bug[];
    assignedBugs?: Nullable<Bug[]>;
    managedProjects?: Nullable<Project[]>;
    projects?: Nullable<Project[]>;
}

export interface IQuery {
    index(): string | Promise<string>;
    securedResource(): string | Promise<string>;
    securedDataForManager(): string | Promise<string>;
    securedDataForDeveloper(): string | Promise<string>;
    securedDataForQA(): string | Promise<string>;
    login(email: string, password: string): string | Promise<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;
