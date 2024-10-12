import { Module } from '@nestjs/common'

import { CoffeesListService } from './coffees-list.service'
import { CoffeesListController } from './coffees-list.controller'
import { PrismaService } from '@/prisma.service'

@Module({
	controllers: [CoffeesListController],
	providers: [CoffeesListService, PrismaService],
})
export class CoffeesListModule {}
