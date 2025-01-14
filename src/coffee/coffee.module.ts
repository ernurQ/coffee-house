import { Module } from '@nestjs/common'
import { CoffeeService } from './coffee.service'
import { CoffeeController } from './coffee.controller'
import { PrismaService } from '@/prisma.service'
import { CountryModule } from '@/country/country.module'

@Module({
	imports: [CountryModule],
	controllers: [CoffeeController],
	providers: [CoffeeService, PrismaService],
	exports: [CoffeeService],
})
export class CoffeeModule {}
