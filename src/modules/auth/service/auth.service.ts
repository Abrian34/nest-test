import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/modules/user/dto/user-dto';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/service/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
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
            
            const payload = { username: user.username, sub: user.user_id};
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
