import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CountryService } from './country.service'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'
import { Roles } from '@/auth/decorators/roles.decorator'

@Controller('countries')
export class CountryController {
	constructor(private readonly countryService: CountryService) {}

	@Post()
	@Roles('EDITOR', 'PRODUCT_MANAGER')
	create(@Body() createCountryDto: CreateCountryDto) {
		return this.countryService.create(createCountryDto)
	}

	@Get()
	findAll() {
		return this.countryService.findAll()
	}

	@Put(':name')
	@Roles('EDITOR', 'PRODUCT_MANAGER')
	update(
		@Param('name') name: string,
		@Body() updateCountryDto: UpdateCountryDto,
	) {
		return this.countryService.update(name, updateCountryDto)
	}

	@Delete(':name')
	@Roles('EDITOR', 'PRODUCT_MANAGER')
	remove(@Param('name') name: string) {
		return this.countryService.remove(name)
	}
}
