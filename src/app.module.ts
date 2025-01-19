import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './modules/songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevConfigService } from './common/providers/DevConfigService';
import { DataSource } from 'typeorm';
import { SongsController } from './modules/songs/controller/songs.controller';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SequelizeModule } from '@nestjs/sequelize';
import { Song } from './modules/songs/entity/songs.entity';
import { UserController } from './modules/user/controller/user.controller';
import { User } from './modules/user/entity/user.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // imports: [SongsModule],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '1234',
      username: 'postgres',
      entities: [Song, User],
      database: 'TestDB',
      synchronize: true,
      logging: true,
    }),
    // SequelizeModule.forRoot({
    //   dialect: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: '1234',
    //   database: 'TestDB',
    //   logging: true
    // }),
    SongsModule,
    UserModule,
    AuthModule,
    // ...appModule.modules,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
        // blockDuration: new EnvConfig().get("THROTTLE_DURATION"),
      },
    ]),
    JwtModule.register({
      secret: 'HAD_12X#@',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
    },
    // {
    //   provide: DevConfigService,
    //   useClass: DevConfigService,
    // },
],
})
export class AppModule implements NestModule{
  constructor(dataTest: DataSource) {
    console.log('DB NAME', dataTest.driver.database)
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController)
  }
  
}
