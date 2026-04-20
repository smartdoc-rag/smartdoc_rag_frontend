import { conversationService } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetConversations = () => {
	const { user } = useAuthStore();
	return useQuery({
		queryKey: ["conversations", user?.id],
		queryFn: () => conversationService.getAllConversations(),
		enabled: !!user,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		select: (data) => {
			return data?.sort(
				(a, b) =>
					new Date(b.last_chat_at).getTime() -
					new Date(a.last_chat_at).getTime(),
			);
		},
	});
};

export const useUpdateConvTitle = () => {
	const { user } = useAuthStore();

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (param: { convId: number; newTitle: string }) =>
			conversationService.updateConservationTitle(param),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["conversations", user?.id],
			});
		},
	});
};

export const useDeleteConv = () => {
	const { user } = useAuthStore();

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (convId: number) =>
			conversationService.deleteConversation(convId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["conversations", user?.id],
			});
		},
	});
};
