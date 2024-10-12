import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { CoffeesListService } from './coffees-list.service'
import { CreateListDto } from '@/coffees-list/dto/create-list.dto'
import { Roles } from '@/auth/decorators/roles.decorator'
import { ApiTags } from '@nestjs/swagger'
import { AddCoffeesDto } from '@/coffees-list/dto/add-coffees.dto'
import { DeleteCoffeesDto } from '@/coffees-list/dto/delete-coffees.dto'

@ApiTags('coffees-lists')
@Controller('coffees-lists')
export class CoffeesListController {
	constructor(private readonly coffeesListService: CoffeesListService) {}

	/**
	 * crate list
	 */
	@Post()
	@Roles('EDITOR', 'CONTENT_MANAGER')
	async create(@Body() dto: CreateListDto) {
		return this.coffeesListService.create(dto)
	}

	/**
	 * add coffee to list
	 */
	@Post('/:listName')
	@Roles('EDITOR', 'CONTENT_MANAGER')
	async addCoffees(
		@Param('listName') listName: string,
		@Body() { ids }: AddCoffeesDto,
	) {
		return this.coffeesListService.addCoffees(listName, ids)
	}

	/**
	 * delete coffee from list
	 */
	@Delete('/:listName')
	@Roles('EDITOR', 'CONTENT_MANAGER')
	async deleteCoffeesFromList(
		@Param('listName') listName: string,
		@Body() { ids }: DeleteCoffeesDto,
	) {
		return this.coffeesListService.deleteCoffees(listName, ids)
	}

	/**
	 * get coffees from list
	 */
	@Get('/:listName')
	async getListCoffees(@Param('listName') name: string) {
		return this.coffeesListService.getOne({ name }, { coffees: true })
	}
}
