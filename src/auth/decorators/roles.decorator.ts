import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

import { Role } from '@/user/role.type'
import { RolesGuard } from '@/auth/guards/roles.guard'

export const Roles = (...roles: Role[]) =>
	applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard))
