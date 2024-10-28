import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(new ValidationPipe()) authDto: SignupDto) {
    return this.authService.signUp(authDto);
  }

  @Post('/signin')
  signIn(@Body(new ValidationPipe()) authDto: SigninDto) {
    return this.authService.signIn(authDto);
  }
}
