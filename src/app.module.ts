import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { LibraryModule } from './library/library.module';
import { FilterModule } from './filter/filter.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { LibraryStatsModule } from './utils/library-stats/library-stats.modules';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    ScheduleModule.forRoot(),
    LibraryModule,
    FilterModule,
    LibraryStatsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
