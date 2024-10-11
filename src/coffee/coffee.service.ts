import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CoffeeDto } from '@/coffee/dto/coffee.dto'
import { Prisma } from '@prisma/client'
import { UpdateCoffeeDto } from '@/coffee/dto/update-coffee.dto'
import * as fs from 'node:fs'

@Injectable()
export class CoffeeService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CoffeeDto, creatorId: string) {
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
						? { country: { contains: country, mode: 'insensitive' } }
						: {},
				],
			},
			skip: offset,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})

		return {
			coffees,
			total: coffees.length,
		}
	}

	async getOne(uniqueInput: Prisma.CoffeeWhereUniqueInput) {
		return this.prisma.coffee.findUnique({
			where: uniqueInput,
		})
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
		const coffee = await this.getOne(uniqueInput)
		if (!coffee) throw new NotFoundException('Coffee not found')

		if (coffee.thumbnail !== '') {
			const oldThumbnailPath = `.${coffee.thumbnail}`
			fs.stat(oldThumbnailPath, () => {
				fs.unlinkSync(oldThumbnailPath)
			})
		}

		return this.prisma.coffee.update({
			where: uniqueInput,
			data: { thumbnail: `/public/coffee-thumbnails/${file.filename}` },
		})
	}
}
