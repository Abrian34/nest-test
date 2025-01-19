import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/service/user.service';
import { JwtModule } from '@nestjs/jwt';
import { SongsModule } from '../songs/songs.module';
import { authConstants } from './auth.constants';
import passport from 'passport';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [UserModule,
    SongsModule, 
    // JwtModule.register({
    //   secret: authConstants.secret,
    //   signOptions: {
    //     expiresIn: '1d'
    //   }
    // }),
    JwtModule.register({
      secret: 'HAD_12X#@',
      signOptions: {expiresIn: '1h'}
    }),
    PassportModule.register({defaultStrategy: 'jwt'})
  ],
  providers: [AuthService, UserService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}