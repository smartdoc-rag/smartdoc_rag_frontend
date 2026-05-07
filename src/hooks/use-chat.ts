import { chatLimit } from "@/constants/const";
import { chatService } from "@/services/chat.service";
import type { AskParams, HistoryMessage } from "@/types/chat.type";
import type { CursorResponse } from "@/types/common/pagination.type";
import {
	type InfiniteData,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

const chatQueryKeys = {
	all: ["history"] as const,
	list: (convId?: number) => ["history", convId] as const,
};
export const useGetHistory = (convId?: number) => {
	return useInfiniteQuery<
		CursorResponse<HistoryMessage>,
		Error,
		InfiniteData<CursorResponse<HistoryMessage>>,
		ReturnType<typeof chatQueryKeys.list>,
		string | null
	>({
		queryKey: chatQueryKeys.list(convId),

		queryFn: ({ pageParam }) =>
			chatService.getHistory({
				convId,
				cursor: pageParam,
				limit: chatLimit,
			}),

		getNextPageParam: (lastPage) =>
			lastPage.meta.has_next ? lastPage.meta.next_cursor : undefined,
		initialPageParam: null,
		enabled: !!convId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes
		refetchOnWindowFocus: false,
	});
};
export const useAsk = (convId?: number) => {
	const queryClient = useQueryClient();
	const queryKey = chatQueryKeys.list(convId);

	return useMutation({
		mutationFn: async (param: AskParams): Promise<HistoryMessage> =>
			chatService.ask(param),

		onMutate: async (param: AskParams) => {
			await queryClient.cancelQueries({ queryKey });

			const prev = queryClient.getQueryData(queryKey);

			const tempId = crypto.randomUUID();

			const fakeMessage: HistoryMessage = {
				request_id: -Date.now(), // Unique negative ID to avoid collision
				question: param.question || "",
				created_at: new Date(),
				tempId,
				isPending: true,
				mode: param.responseType as "dual" | "single",
				responses: [],
			};

			queryClient.setQueryData<InfiniteData<CursorResponse<HistoryMessage>>>(
				queryKey,
				(old) => {
					if (!old) return old;

					// nếu chưa có page
					if (old.pages.length === 0) {
						return {
							...old,
							pages: [
								{
									items: [fakeMessage],
									meta: { has_next: false, next_cursor: null },
								},
							],
						};
					}

					return {
						...old,
						pages: old.pages.map((page, index) => {
							if (index !== 0) return page;

							return {
								...page,
								items: [fakeMessage, ...page.items], // BE DESC
							};
						}),
					};
				},
			);

			return { prev, tempId };
		},

		onError: (_err, _vars, context) => {
			if (context?.prev) {
				queryClient.setQueryData(queryKey, context.prev);
			}
		},

		onSuccess: (data: HistoryMessage, _vars, context) => {
			queryClient.setQueryData<InfiniteData<CursorResponse<HistoryMessage>>>(
				queryKey,
				(old) => {
					if (!old) return old;

					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							items: page.items.map((msg) =>
								msg.tempId === context?.tempId
									? {
											...data,
											tempId: context?.tempId, // Preserve tempId for stable keys
											isPending: false,
										}
									: msg,
							),
						})),
					};
				},
			);
		},
	});
};

export const useClearHistory = (convId?: number) => {
	const queryClient = useQueryClient();
	const queryKey = chatQueryKeys.list(convId);

	return useMutation({
		mutationFn: async (id?: number) => {
			const conversationId = id || convId;
			if (!conversationId) throw new Error("Conversation ID is required");
			return await chatService.clearHistory(conversationId);
		},

		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });

			const previousData =
				queryClient.getQueryData<InfiniteData<CursorResponse<HistoryMessage>>>(
					queryKey,
				);

			queryClient.setQueryData<InfiniteData<CursorResponse<HistoryMessage>>>(
				queryKey,
				(old) => {
					if (!old) return old;

					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							items: [
								{
									request_id: -1,
									question: "Conversation cleared",
									created_at: new Date(),
									responses: [],
								} as HistoryMessage,
							],
							meta: {
								has_next: false,
								next_cursor: null,
							},
						})),
					};
				},
			);

			return { previousData };
		},

		onError: (_err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(queryKey, context.previousData);
			}
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey,
				refetchType: "none",
			});
		},
	});
};
