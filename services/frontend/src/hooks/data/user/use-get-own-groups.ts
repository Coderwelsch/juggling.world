import { useAuthorizedRequest } from "@/src/hooks/data/auth/use-authorized-request"
import { Group } from "@/src/types/cms/api"

export const useGetOwnGroups = () => {
	return useAuthorizedRequest<Group[]>({
		path: "/user/group",
		authOptions: {
			method: "GET",
		},
	})
}
