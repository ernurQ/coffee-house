import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtAuthGuard } from './jwt.guard'

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {
		super()
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isAuthenticated = await super.canActivate(context)
		if (!isAuthenticated) {
			return false
		}

		const roles = this.reflector.get<string[]>('roles', context.getHandler())
		if (!roles || roles.length === 0) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const user = request.user

		return roles.includes(user.role)
	}
}
