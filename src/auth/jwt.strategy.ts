import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtConfig } from '@/config/configuration'
import { UserService } from '@/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UserService,
		@Inject(JwtConfig.KEY)
		private readonly jwtConfig: ConfigType<typeof JwtConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfig.secret,
		})
	}

	async validate({ sub }: { sub: string }) {
		return this.userService.getOne({ id: sub })
	}
}
