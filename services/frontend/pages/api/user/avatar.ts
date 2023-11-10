import { auth } from "@/pages/api/auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"
import httpProxyMiddleware from "next-http-proxy-middleware"

// For preventing header corruption, specifically Content-Length header
export const config = {
	api: {
		bodyParser: false,
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await auth(req, res)

	if (!session) {
		res.status(418).end()
		return
	}

	console.log("upload avatar session", session)

	req.url = req.url!.replace("/api/user/avatar", "/upload")

	const result = await httpProxyMiddleware(req, res, {
		target: `http://strapi`,
	})

	res.send(result)
}
