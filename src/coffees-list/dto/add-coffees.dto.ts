import { IsString } from 'class-validator'

export class AddCoffeesDto {
	@IsString({ each: true })
	ids: string[]
}
