import {
	Body,
	Controller,
	FileTypeValidator,
	Get,
	NotFoundException,
	Param,
	ParseFilePipe,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { extname } from 'path'

import { CoffeeService } from './coffee.service'
import { CoffeeDto } from '@/coffee/dto/coffee.dto'
import { UpdateCoffeeDto } from '@/coffee/dto/update-coffee.dto'
import { Roles } from '@/auth/decorators/roles.decorator'
import { GetUser } from '@/auth/decorators/user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@ApiTags('coffees')
@Controller('coffees')
export class CoffeeController {
	constructor(private readonly coffeeService: CoffeeService) {}

	/**
	 * create coffee
	 */
	@Post()
	@Roles('EDITOR', 'PRODUCT_MANAGER')
	async create(@Body() dto: CoffeeDto, @GetUser('id') id: string) {
		return this.coffeeService.create(dto, id)
	}

	/**
	 * get coffees
	 */
	@Get()
	async getMany(
		@Query('name') name?: string,
		@Query('country') country?: string,
		@Query('offset') offset?: number,
		@Query('limit') limit?: number,
	) {
		offset = offset || 0
		limit = limit || 10
		return this.coffeeService.getMany(name, country, offset, limit)
	}

	/**
	 * get one coffee
	 */
	@Get('/:id')
	async getOne(@Param('id') id: string) {
		const coffee = await this.coffeeService.getOne({ id })
		if (!coffee) throw new NotFoundException('coffee not found')
		return coffee
	}

	/**
	 * update coffee
	 */
	@Put('/:id')
	@Roles('EDITOR', 'PRODUCT_MANAGER')
	async update(@Param('id') id: string, @Body() dto: UpdateCoffeeDto) {
		return this.coffeeService.update({ id }, dto)
	}

	/**
	 * upload coffee thumbnail
	 */
	@Post('/:id/thumbnail')
	@Roles('EDITOR', 'PRODUCT_MANAGER')
	@UseInterceptors(
		FileInterceptor('thumbnail', {
			storage: diskStorage({
				destination: './public/coffee-thumbnails',
				filename: (_, file, cb) => {
					const filename = `${Date.now()}${extname(file.originalname)}`
					cb(null, filename)
				},
			}),
		}),
	)
	async uploadThumbnail(
		@Param('id') id: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: 'image' })],
			}),
		)
		file: Express.Multer.File,
	) {
		return this.coffeeService.updateThumbnail({ id }, file)
	}
}
