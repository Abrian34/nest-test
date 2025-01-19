import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserService } from "src/modules/user/service/user.service";
import { LoginDTO, UserDTO } from "src/modules/user/dto/user-dto";
import { User } from "src/modules/user/entity/user.entity";
import { AuthService } from "../service/auth.service";

@Controller('auth')
// @UseGuards(ThrottlerRateLimitGuard)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
) {}
  @Post('signup')
  signup(
    @Body()
    userDTO: UserDTO
  ) : Promise<User> {
    return this.userService.create(userDTO)
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO
  ) {
    return this.authService.login(loginDTO)
  }
}
