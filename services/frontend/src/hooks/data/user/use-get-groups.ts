import { useAuthorizedRequest } from "@/src/hooks/data/auth/use-authorized-request"
import { UserGroup } from "@/src/types/cms/graphql"

export const useGetGroups = () => {
	return useAuthorizedRequest<(UserGroup & { id: string })[]>({
		path: "/user/group",
		authOptions: {
			method: "GET",
		},
	})
}
