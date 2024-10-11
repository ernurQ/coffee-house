import { registerAs } from '@nestjs/config'

export const AppConfig = registerAs('app', () => ({
	port: parseInt(process.env.PORT || '3001', 10),
}))

export const JwtConfig = registerAs('jwt', () => ({
	secret: process.env.JWT_SECRET,
	accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
}))

export const RootUserConfig = registerAs('rootUser', () => ({
	username: process.env.ROOT_USER_USERNAME,
	password: process.env.ROOT_USER_PASSWORD,
}))
