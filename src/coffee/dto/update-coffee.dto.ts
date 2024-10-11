import { PartialType } from '@nestjs/swagger'
import { CoffeeDto } from '@/coffee/dto/coffee.dto'

export class UpdateCoffeeDto extends PartialType<CoffeeDto>(CoffeeDto) {}
