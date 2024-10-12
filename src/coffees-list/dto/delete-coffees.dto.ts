import { IsString } from 'class-validator'

export class DeleteCoffeesDto {
	@IsString({ each: true })
	ids: string[]
}
