import { conversationService } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation, ConversationConfigParam } from "@/types/conversation.type";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { convLimit } from "@/constants/const";
import type { CursorResponse } from "@/types/common/pagination.type";

const conversationKeys = {
	all: ["conversations"] as const,
	list: (userId?: string) => ["conversations", userId] as const,
};


export const useGetConversations = () => {
	const { user } = useAuthStore();

	return useInfiniteQuery<
		CursorResponse<Conversation>, // dữ liệu mỗi page
		Error,                        // error
		InfiniteData<CursorResponse<Conversation>>,
		ReturnType<typeof conversationKeys.list>, // queryKey type
		string | null                
	>({
		queryKey: conversationKeys.list(user?.id),

		queryFn: ({ pageParam }) =>
			conversationService.getAllConversations({
				cursor: pageParam,
				limit: convLimit,
			}),

		getNextPageParam: (lastPage) =>
			lastPage.meta.has_next
				? lastPage.meta.next_cursor
				: undefined,

		initialPageParam: null,

		enabled: !!user,
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
				queryClient.getQueryData<InfiniteData<CursorResponse<Conversation>>>(queryKey);

			queryClient.setQueryData<InfiniteData<CursorResponse<Conversation>>>(
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
				queryClient.getQueryData<InfiniteData<CursorResponse<Conversation>>>(queryKey);

			queryClient.setQueryData<InfiniteData<CursorResponse<Conversation>>>(
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

export const useUpdateLastChat = () => {
	const { user } = useAuthStore();
	const queryClient = useQueryClient();
	const queryKey = conversationKeys.list(user?.id);

	return useMutation({
		mutationFn: (convId: number) =>
			conversationService.updateLastChat(convId),

		onMutate: async (convId) => {
			await queryClient.cancelQueries({ queryKey });

			const prev =
				queryClient.getQueryData<
					InfiniteData<CursorResponse<Conversation>>
				>(queryKey);

			queryClient.setQueryData<
				InfiniteData<CursorResponse<Conversation>>
			>(queryKey, (old) => {
				if (!old) return old;

				let movedConv: Conversation | null = null;

				const newPages = [...old.pages];

				for (let i = 0; i < newPages.length; i++) {
					const page = newPages[i];
					const idx = page.items.findIndex((c) => c.id === convId);

					if (idx !== -1) {
						movedConv = page.items[idx];

						const newItems = [...page.items];
						newItems.splice(idx, 1);

						newPages[i] = {
							...page,
							items: newItems,
						};

						break; 
					}
				}

				if (!movedConv) return old;

				const updatedConv: Conversation = {
					...movedConv,
					last_chat_at: new Date(),
				};

				newPages[0] = {
					...newPages[0],
					items: [updatedConv, ...newPages[0].items],
				};

				return {
					...old,
					pages: newPages,
				};
			});

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