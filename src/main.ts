import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors()
	app.setGlobalPrefix('api')
	setupSwagger(app)
	setupDTOSerialization(app)

	const configService = app.get(ConfigService)
	const port = configService.get<number>('app.port')!

	await app.listen(port, () => {
		console.log(`Server is running on port: ${port}`)
	})
}
bootstrap()

function setupSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Coffee house backend API')
		.setVersion('1.0')
		.addTag('Coffee house backend API')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document)
}

function setupDTOSerialization(app: INestApplication) {
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	)
}
