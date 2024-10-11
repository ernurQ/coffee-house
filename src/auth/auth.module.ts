import { ConfigType } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtConfig } from '@/config/configuration'
import { JwtStrategy } from '@/auth/jwt.strategy'
import { UserModule } from '@/user/user.module'

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [JwtConfig.KEY],
			useFactory: (jwtConfig: ConfigType<typeof JwtConfig>) => ({
				secret: jwtConfig.secret,
				signOptions: { expiresIn: jwtConfig.accessTokenExpiresIn },
			}),
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
