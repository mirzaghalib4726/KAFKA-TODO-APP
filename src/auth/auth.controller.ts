import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { Public } from 'src/decorators/custom.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  create(@Body() data: SignUpDto) {
    return this.authService.signup(data);
  }

  @Public()
  @Post('sign-in')
  findAll(@Body() data: SignInDto) {
    return this.authService.signin(data);
  }
}
