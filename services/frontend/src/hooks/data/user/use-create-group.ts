import {
	ErrorResponse,
	useAuthorizedMutation,
} from "@/src/hooks/data/auth/use-authorized-mutation"
import { UserGroupEntity, UserGroupInput } from "@/src/types/cms/graphql"

export interface CreateGroupInput
	extends Pick<
		UserGroupInput,
		"name" | "location" | "description" | "members"
	> {
	name: string
	description: string
	members: Array<string>
	location: {
		latitude: number
		longitude: number
	}
	avatar: File | null
}

export const useCreateGroup = (
	props?: { onMutate?: () => void } | undefined,
) => {
	return useAuthorizedMutation<FormData, UserGroupEntity & ErrorResponse>({
		path: "/user/group",
		invalidationKeys: ["/user/discipline", "/user/group", "/user/me"],
		authOptions: {
			method: "POST",
		},
		onMutate: props?.onMutate,
	})
}
