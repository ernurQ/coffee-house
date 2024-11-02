import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CoffeeDto } from '@/coffee/dto/coffee.dto'
import { Coffee, Prisma } from '@prisma/client'
import { UpdateCoffeeDto } from '@/coffee/dto/update-coffee.dto'
import * as fs from 'node:fs'
import { AppConfig } from '@/config/configuration'
import { ConfigType } from '@nestjs/config'
import { CountryService } from '@/country/country.service'

@Injectable()
export class CoffeeService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(AppConfig.KEY)
		private readonly appConfig: ConfigType<typeof AppConfig>,
		private readonly countryService: CountryService,
	) {}

	async create(dto: CoffeeDto, creatorId: string) {
		const country = await this.countryService.getOne({ name: dto.countryName })
		if (!country) throw new NotFoundException('country not found')
		return this.prisma.coffee.create({
			data: {
				...dto,
				creatorId,
			},
		})
	}

	async getMany(name?: string, country?: string, offset = 0, limit = 10) {
		const coffees = await this.prisma.coffee.findMany({
			where: {
				AND: [
					name ? { name: { contains: name, mode: 'insensitive' } } : {},
					country
						? { countryName: { contains: country, mode: 'insensitive' } }
						: {},
				],
			},
			skip: offset,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})

		await this.addThumbnailDomain(coffees)

		return {
			coffees,
			total: coffees.length,
		}
	}

	async getOne(uniqueInput: Prisma.CoffeeWhereUniqueInput) {
		const coffee = await this.prisma.coffee.findUnique({
			where: uniqueInput,
		})
		if (!coffee) throw new NotFoundException('coffee not found')
		await this.addThumbnailDomain(coffee)
		return coffee
	}

	async update(
		uniqueInput: Prisma.CoffeeWhereUniqueInput,
		dto: UpdateCoffeeDto,
	) {
		const coffee = await this.getOne(uniqueInput)
		if (!coffee) throw new NotFoundException(`Coffee not found`)

		return this.prisma.coffee.update({
			where: uniqueInput,
			data: dto,
		})
	}

	async updateThumbnail(
		uniqueInput: Prisma.CoffeeWhereUniqueInput,
		file: Express.Multer.File,
	) {
		const coffee = await this.prisma.coffee.findUnique({
			where: uniqueInput,
		})
		if (!coffee) throw new NotFoundException('Coffee not found')

		if (coffee.thumbnail !== '') {
			const oldThumbnailPath = `.${coffee.thumbnail}`
			fs.stat(oldThumbnailPath, () => {
				try {
					fs.unlinkSync(oldThumbnailPath)
				} catch (e) {
					console.log(e)
				}
			})
		}

		return this.prisma.coffee.update({
			where: uniqueInput,
			data: { thumbnail: `/public/coffee-thumbnails/${file.filename}` },
		})
	}

	async addThumbnailDomain(coffees: Coffee | Coffee[]) {
		const thumbnailDomain = this.appConfig.thumbnailDomain
		if (Array.isArray(coffees)) {
			coffees.forEach((coffee) => {
				coffee.thumbnail = `${thumbnailDomain}${coffee.thumbnail}`
			})
			return
		}
		coffees.thumbnail = `${thumbnailDomain}${coffees.thumbnail}`
	}
}
