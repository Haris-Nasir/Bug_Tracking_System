
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    index(): string | Promise<string>;
    securedResource(): string | Promise<string>;
    securedDataForAdmin(): string | Promise<string>;
    securedDataForNormal_User(): string | Promise<string>;
    login(email: string, password: string): string | Promise<string>;
}

type Nullable<T> = T | null;
