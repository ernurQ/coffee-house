import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { Prisma } from '@prisma/client'
import { RegisterDto } from '@/auth/dto/register.dto'
import * as bcrypt from 'bcrypt'
import { ConfigType } from '@nestjs/config'
import { RootUserConfig } from '@/config/configuration'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		@Inject(RootUserConfig.KEY)
		private readonly rootUserConfig: ConfigType<typeof RootUserConfig>,
	) {}

	async create(dto: RegisterDto) {
		const userExists = await this.getOne({ username: dto.username })
		if (userExists)
			throw new ConflictException(
				`User with username ${dto.username} already exists`,
			)

		dto.password = await bcrypt.hash(dto.password, 10)

		return this.prisma.user.create({
			select: { id: true, username: true, role: true },
			data: dto,
		})
	}

	async getOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		})
	}
}
