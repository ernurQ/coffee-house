import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext } from '@nestjs/common'

export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}
}
