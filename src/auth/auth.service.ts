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
import { Role } from '@/user/role.type'

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
		const { token } = await this.getTokens(user.id, user.role)

		return { token, role: user.role }
	}

	private async validateUser({ username, password }: LoginDto) {
		const user = await this.userService.getOne({ username })
		if (!user) throw new NotFoundException('User not found')

		const isCorrectPassword = await bcrypt.compare(password, user.password)
		if (!isCorrectPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	private async getTokens(id: string, role: Role) {
		const payload = { sub: id, role }
		const token = this.jwtService.sign(payload)
		return { token }
	}
}
