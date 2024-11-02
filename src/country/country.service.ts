import { Injectable, OnModuleInit } from '@nestjs/common'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'
import { PrismaService } from '@/prisma.service'
import { Country, Prisma } from '@prisma/client'

@Injectable()
export class CountryService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	async getOne(uniqueInput: Prisma.CountryWhereUniqueInput) {
		return this.prisma.country.findUnique({ where: uniqueInput })
	}

	async create(createCountryDto: CreateCountryDto) {
		return this.prisma.country.create({ data: createCountryDto })
	}

	async findAll() {
		return this.prisma.country.findMany()
	}

	async update(name: string, updateCountryDto: UpdateCountryDto) {
		return this.prisma.country.update({
			where: { name },
			data: updateCountryDto,
		})
	}

	async remove(name: string) {
		return this.prisma.country.delete({ where: { name } })
	}

	async onModuleInit() {
		const countries: Country[] = [
			{
				name: 'Columbia',
			},
			{
				name: 'Brazil',
			},
			{
				name: 'Kenya',
			},
		]
		const existingCoffees = await this.prisma.country.findMany({
			where: { OR: countries },
		})

		console.log(existingCoffees)
		if (existingCoffees.length !== 0) return
		await this.prisma.country.createMany({ data: [] })
	}
}
