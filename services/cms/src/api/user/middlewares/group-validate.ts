/**
 * `validate` middleware
 */

import { File } from "@babel/types"
import { Strapi } from "@strapi/strapi"
import { z } from "zod"

interface UserGroupCreationInput {
	avatar?: File
	location: {
		latitude: number
		longitude: number
	},
	contact?: {
		email?: string | null; // String
		facebook?: string | null; // String
		id?: string | null; // ID
		instagram?: string | null; // String
		reddit?: string | null; // String
		signal?: string | null; // String
		telegram?: string | null; // String
		whatsapp?: string | null; // String
	}
	description?: string
	members?: number[]
	name: string
}

export const UserGroupCreationInputSchema = z.object({
	avatar: z.any().optional(),
	location: z.object({
		latitude: z.number(),
		longitude: z.number(),
	}),
	contact: z.object({
		email: z.string().optional().nullable(),
		facebook: z.string().optional().nullable(),
		id: z.string().optional().nullable(),
		instagram: z.string().optional().nullable(),
		reddit: z.string().optional().nullable(),
		signal: z.string().optional().nullable(),
		telegram: z.string().optional().nullable(),
		whatsapp: z.string().optional().nullable(),
	}).optional(),
	description: z.string().optional().nullable(),
	members: z.array(z.number()).optional(),
	name: z.string(),
})

export default (config, { strapi }: { strapi: Strapi }) => {
	// Add your own logic here.
	return async (ctx, next) => {
		strapi.log.info("In validate middleware.")

		console.log("validate body", ctx.request.body)

		await next()
	}
}
