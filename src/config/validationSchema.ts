import * as Joi from 'joi'

export const validationSchema = Joi.object({
	PORT: Joi.number().required(),
	JWT_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
	ROOT_USER_USERNAME: Joi.string().required(),
	ROOT_USER_PASSWORD: Joi.string().required(),
})
