import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/modules/user/dto/user-dto';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/service/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SongsService } from 'src/modules/songs/service/songs.service';
import { PayloadType } from '../types';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private songService: SongsService
    ) {}

    async login(loginDTO: LoginDTO): Promise<{accessToken: string}> {
        const user = await this.userService.findLogin(loginDTO)

        const hashedPasswordFlag = await bcrypt.compare(
            loginDTO.password, 
            user.password
        );

        if (hashedPasswordFlag) {
            delete user.password
            // return user
            
            const payload: PayloadType = { username: user.username, user_id: user.user_id};
            const songs = await this.songService.findByUser(user.user_id)
            if (songs.length > 0) {
                payload.song_id = songs[0].song_id
            }
            return {
                accessToken: this.jwtService.sign(payload)
            };
        } else {
            throw new UnauthorizedException('Password does not match')
        }
        
    }

    async validateUserByApiKey(apiKey: string): Promise<User> {
        return this.userService.getByApiKey(apiKey);
      }
}
