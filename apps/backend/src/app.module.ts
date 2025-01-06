import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { CitiesModule } from './cities/cities.module';
import { UniversitiesModule } from './universities/universities.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    EventModule,
    UsersModule,
    CitiesModule,
    UploadsModule,
    UniversitiesModule,
  ],
})
export class AppModule {}
