import { conversationService } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ConversationConfigParam, ConversationList } from "@/types/conversation.type";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { convLimit } from "@/constants/const";

const conversationKeys = {
	all: ["conversations"] as const,
	list: (userId?: string) => ["conversations", userId] as const,
};


export const useGetConversations = () => {
	const { user } = useAuthStore();

	return useInfiniteQuery({
		queryKey: ["conversations", user?.id],

		queryFn: ({ pageParam = 1 }) =>
			conversationService.getAllConversations({
				page: pageParam,
				limit: convLimit,
			}),

		getNextPageParam: (lastRes) =>
			lastRes.pagination.has_next
				? lastRes.pagination.next_page ?? undefined
				: undefined,

		initialPageParam: 1,

		enabled: !!user,

		refetchOnWindowFocus: false,

		staleTime: 1000 * 60 * 5, 
		gcTime: 1000 * 60 * 30,  

		placeholderData: (prev) => prev,
	});
};


export const useCreateConv = () => {
	return useMutation({
		mutationFn: (title: string) =>
			conversationService.createConversation(title),
	})
}

export const useUpdateConvTitle = () => {
	const { user } = useAuthStore();
	const queryClient = useQueryClient();
	const queryKey = conversationKeys.list(user?.id);

	return useMutation({
		mutationFn: (param: { convId: number; newTitle: string }) =>
			conversationService.updateConversationTitle(param),

		onMutate: async ({ convId, newTitle }) => {
			await queryClient.cancelQueries({ queryKey });

			const prev =
				queryClient.getQueryData<InfiniteData<ConversationList>>(queryKey);

			queryClient.setQueryData<InfiniteData<ConversationList>>(
				queryKey,
				(old) => {
					if (!old) return old;

					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							items: page.items.map((conv) =>
								conv.id === convId
									? { ...conv, title: newTitle }
									: conv
							),
						})),
					};
				}
			);

			return { prev };
		},

		onError: (_err, _vars, context) => {
			if (context?.prev) {
				queryClient.setQueryData(queryKey, context.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});
};

export const useDeleteConv = () => {
	const { user } = useAuthStore();
	const queryClient = useQueryClient();
	const queryKey = conversationKeys.list(user?.id);

	return useMutation({
		mutationFn: (convId: number) =>
			conversationService.deleteConversation(convId),

		onMutate: async (convId) => {
			await queryClient.cancelQueries({ queryKey });

			const prev =
				queryClient.getQueryData<InfiniteData<ConversationList>>(queryKey);

			queryClient.setQueryData<InfiniteData<ConversationList>>(
				queryKey,
				(old) => {
					if (!old) return old;

					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							items: page.items.filter(
								(conv) => conv.id !== convId
							),
						})),
					};
				}
			);

			return { prev };
		},

		onError: (_err, _vars, context) => {
			if (context?.prev) {
				queryClient.setQueryData(queryKey, context.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});
};

export const useGetConvById = (convId?: number) => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ["conversation", convId],
        queryFn: () => {
			if (!convId) throw new Error("convId is required");
			return conversationService.getConversationById(convId);
		},
        enabled: !!user && !!convId,
        refetchOnWindowFocus: false
    });
};

export const useUpdateConvConfig = () => {
	const { user } = useAuthStore();
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (param : ConversationConfigParam) => {
			if (!user) throw new Error("Unauthorized");
			return conversationService.updateChunkConfig(param)
		},

		onSuccess: (res) => {
			queryClient.invalidateQueries({queryKey: ["conversation", res.id]})
		}
	})
}