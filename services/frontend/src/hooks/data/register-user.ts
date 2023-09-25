import {
	createUser,
	UserCreationMutation,
} from "@/src/queries/register-user-mutation"
import { useMutation } from "@tanstack/react-query"

export const useRegisterUser = () => {
	return useMutation({
		mutationFn: async (data: UserCreationMutation) => {
			return createUser(data)
		},
	})
}
