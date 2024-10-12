import {
	ConflictException,
	Injectable,
	NotFoundException,
	OnModuleInit,
} from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateListDto } from '@/coffees-list/dto/create-list.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class CoffeesListService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	async getOne(
		uniqueInput: Prisma.CoffeesListWhereUniqueInput,
		include?: Prisma.CoffeesListInclude,
	) {
		return this.prisma.coffeesList.findUnique({ where: uniqueInput, include })
	}

	async create({ name }: CreateListDto) {
		const listExists = await this.getOne({ name })
		if (listExists)
			throw new ConflictException(`List with name ${name} already exists`)

		return this.prisma.coffeesList.create({ data: { name } })
	}

	async addCoffees(listName: string, coffeeIds: string[]) {
		const list = await this.getOne({ name: listName })
		if (!list) throw new NotFoundException('List not found')

		return this.prisma.coffeesList.update({
			where: { name: listName },
			data: {
				coffees: {
					connect: coffeeIds.map((id) => ({ id })),
				},
			},
			include: { coffees: true },
		})
	}

	async deleteCoffees(listName: string, ids: string[]) {
		const list = await this.getOne({ name: listName })
		if (!list) throw new NotFoundException('List not found')

		return this.prisma.coffeesList.update({
			where: { name: listName },
			data: {
				coffees: {
					disconnect: ids.map((id) => ({ id })),
				},
			},
			include: { coffees: true },
		})
	}

	async onModuleInit() {
		await this.createInitLists()
	}

	async createInitLists() {
		const initLists = await this.prisma.coffeesList.findMany({
			where: {
				OR: [
					{
						name: 'best',
					},
					{
						name: 'pleasure',
					},
				],
			},
		})
		if (initLists.length !== 0) return

		await this.prisma.coffeesList.createMany({
			data: [
				{
					name: 'best',
				},
				{
					name: 'pleasure',
				},
			],
		})
	}
}
