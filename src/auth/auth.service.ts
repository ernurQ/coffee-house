import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UserService } from '@/user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async register(dto: RegisterDto) {
		return this.userService.create(dto)
	}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const { token } = await this.getTokens(user.id)

		return { token }
	}

	private async validateUser({ username, password }: LoginDto) {
		const user = await this.userService.getOne({ username })
		if (!user) throw new NotFoundException('User not found')

		const isCorrectPassword = bcrypt.compare(password, user.password)
		if (!isCorrectPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	private async getTokens(id: string) {
		const payload = { sub: id }
		const token = this.jwtService.sign(payload)
		return { token }
	}
}
