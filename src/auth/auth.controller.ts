import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Зареєструвати користувача',
    description: 'Створює нового користувача в системі.',
  })
  @ApiResponse({ status: 201, description: 'Користувача зареєстровано' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Увійти в систему',
    description: 'Повертає JWT accessToken для авторизації.',
  })
  @ApiResponse({ status: 200, description: 'Успішний вхід' })
  @ApiResponse({ status: 401, description: 'Невірний email або пароль' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}