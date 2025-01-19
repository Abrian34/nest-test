import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './modules/auth/jwt-guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Req()
    req,
  ) {
    return req.user;
  }
}
