import { Module } from '@nestjs/common'
import { CountryService } from './country.service'
import { CountryController } from './country.controller'
import { PrismaService } from '@/prisma.service'

@Module({
	controllers: [CountryController],
	providers: [CountryService, PrismaService],
	exports: [CountryService],
})
export class CountryModule {}
