import { sanitize, validateYupSchema, yup } from "@strapi/utils"

export const FILE_MODEL_UID = "plugin::upload.file"

export const getUploadService = (name) => {
	return strapi.plugin("upload").service(name)

}

export const fileInfoSchema = yup
	.object({
		name: yup.string().nullable(),
		alternativeText: yup.string().nullable(),
		caption: yup.string().nullable(),
	})
	.noUnknown()

export const uploadSchema = yup.object({
	fileInfo: fileInfoSchema,
})

export const multiUploadSchema = yup.object({
	fileInfo: yup.array().of(fileInfoSchema),
})

export const validateUploadBody = (data = {}, isMulti = false) => {
	const schema = isMulti ? multiUploadSchema : uploadSchema
	return validateYupSchema(schema, { strict: false })(data)
}

export const sanitizeOutput = async (data, ctx) => {
	const schema = strapi.getModel(FILE_MODEL_UID)
	const { auth } = ctx.state

	return sanitize.contentAPI.output(data, schema, { auth })
}

export const uploadFile = async (ctx) => {
	const {
		request: { body, files: { files = {} } = {} },
	} = ctx

	const data = await validateUploadBody(body, Array.isArray(files))
	const apiUploadFolderService = getUploadService("api-upload-folder")
	const apiUploadFolder = await apiUploadFolderService.getAPIUploadFolder()

	if (Array.isArray(files)) {
		data.fileInfo = data.fileInfo || []
		data.fileInfo = files.map((_f, i) => ({ ...data.fileInfo[i], folder: apiUploadFolder.id }))
	} else {
		data.fileInfo = { ...data.fileInfo, folder: apiUploadFolder.id }
	}

	const uploadedFiles = await getUploadService("upload").upload({
		data,
		files,
	})

	return await sanitizeOutput(uploadedFiles, ctx)
}
