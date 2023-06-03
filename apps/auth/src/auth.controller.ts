import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  MessagePattern,
  Ctx,
  RmqContext,
  Payload,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { NewUserDTO } from './dto/new-user.dto';
import { ExistinUserDTO } from './dto/existing-user.dto';
import { JwtGuard } from './jwt.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Ctx() context: RmqContext, @Payload() newUser: NewUserDTO) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.register(newUser);
  }

  @MessagePattern({ cmd: 'login' })
  async login(
    @Ctx() context: RmqContext,
    @Payload() existingUser: ExistinUserDTO,
  ) {
    console.log('get inside auth controller: ', existingUser);
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(existingUser);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.verifyJwt(payload.jwt);
  }
}
