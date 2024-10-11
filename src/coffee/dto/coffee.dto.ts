import { IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CoffeeDto {
	@IsString()
	@IsOptional()
	thumbnail: string

	@IsString()
	name: string

	@IsString()
	country: string

	@IsString()
	description: string

	@Type(() => Number)
	@IsNumber()
	@Min(0, { message: 'Price must not be less than 0' })
	price: number
}
