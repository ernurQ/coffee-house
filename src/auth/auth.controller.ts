import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { RegisterDto } from '@/auth/dto/register.dto'
import { Roles } from '@/auth/decorators/roles.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * register
	 */
	@Post('register')
	@Roles('ADMIN')
	@ApiConflictResponse({ description: 'User already exists' })
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	/**
	 * login
	 */
	@Post('login')
	@HttpCode(200)
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBadRequestResponse({ description: 'User not found' })
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto)
	}
}
