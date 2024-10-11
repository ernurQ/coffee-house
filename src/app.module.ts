import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/auth/auth.module'
import { UserModule } from '@/user/user.module'
import { AppConfig, JwtConfig, RootUserConfig } from '@/config/configuration'
import { validationSchema } from '@/config/validationSchema'
import { AppService } from '@/app.service'
import { CoffeeModule } from './coffee/coffee.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [AppConfig, JwtConfig, RootUserConfig],
			validationSchema: validationSchema,
		}),
		AuthModule,
		UserModule,
		CoffeeModule,
	],
	providers: [AppService],
})
export class AppModule {}
