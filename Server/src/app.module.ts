import { ApolloDriver } from '@nestjs/apollo';
import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppResolver } from './app.resolver';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BugResolver } from './bug/bug.resolver';
import { ProjectResolver } from './project/project.resolver';

@Module({
  imports: [
    UserModule,
    AuthModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'book_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('Database connection is successful');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}
