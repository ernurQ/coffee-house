import { IsEnum, IsString, MinLength } from 'class-validator'
import { Role } from '@/user/role.type'

export class RegisterDto {
	@IsString()
	username: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	password: string

	@IsEnum(['ADMIN', 'PRODUCT_MANAGER', 'CONTENT_MANAGER', 'EDITOR', 'VIEWER'], {
		message:
			'Role must be one of the following: ADMIN, PRODUCT_MANAGER, CONTENT_MANAGER, EDITOR, VIEWER',
	})
	role: Role
}
