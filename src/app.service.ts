import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { RootUserConfig } from '@/config/configuration'
import { ConfigType } from '@nestjs/config'
import { UserService } from '@/user/user.service'

@Injectable()
export class AppService implements OnModuleInit {
	constructor(
		@Inject(RootUserConfig.KEY)
		private readonly rootUserConfig: ConfigType<typeof RootUserConfig>,
		private readonly userService: UserService,
	) {}

	async onModuleInit() {
		const username = this.rootUserConfig.username
		const password = this.rootUserConfig.password

		const adminExists = await this.userService.getOne({ username })
		if (adminExists) return

		await this.userService.create({
			username,
			password,
			role: 'ADMIN',
		})
		console.log('Created root user')
	}
}
