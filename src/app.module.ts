import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/auth/auth.module'
import { UserModule } from '@/user/user.module'
import { AppConfig, JwtConfig, RootUserConfig } from '@/config/configuration'
import { validationSchema } from '@/config/validationSchema'
import { AppService } from '@/app.service'
import { CoffeeModule } from './coffee/coffee.module'
import { CoffeesListModule } from './coffees-list/coffees-list.module'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [AppConfig, JwtConfig, RootUserConfig],
			validationSchema: validationSchema,
		}),
		ServeStaticModule.forRoot({
			rootPath: './public',
			serveRoot: '/public',
		}),
		AuthModule,
		UserModule,
		CoffeeModule,
		CoffeesListModule,
	],
	providers: [AppService],
})
export class AppModule {}
