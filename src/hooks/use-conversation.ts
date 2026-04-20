import { conversationService } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation, ConversationConfigParam } from "@/types/conversation.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const conversationKeys = {
  all: ["conversations"] as const,
  list: (userId?: string) => ["conversations", userId] as const,
};


export const useGetConversations = () => {
	const { user } = useAuthStore();
	const queryKey = conversationKeys.list(user?.id)

	return useQuery({
		queryKey,
		queryFn: () => conversationService.getAllConversations(),
		enabled: !!user,
		refetchOnWindowFocus: false,
		select: (data) => {
			return [...(data ?? [])].sort(
				(a, b) =>
				new Date(b.last_chat_at).getTime() -
				new Date(a.last_chat_at).getTime()
			);
		}
	});
};


export const useCreateConv = () => {
	const {user} = useAuthStore();
	const queryKey = conversationKeys.list(user?.id)
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (title: string) =>
			conversationService.createConversation(title),

		onMutate: async(title) => {
			await queryClient.cancelQueries({queryKey })

			const prev = queryClient.getQueryData(queryKey) as Conversation[];

			const fakeConv: Conversation = {
				id: Date.now(),
				created_at: new Date(),
				last_chat_at: new Date(),
				title: title,
				chunk_size: 1500,
				chunk_overlap: 100
			}

			queryClient.setQueryData(
				queryKey,
				(old: Conversation[]) => [...old, fakeConv]
			)

			return {prev}
		},

		onError: (_err, _vars, context) => {
			queryClient.setQueryData(queryKey, context?.prev);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		}
	})
}

export const useUpdateConvTitle = () => {
	const { user } = useAuthStore();

	const queryClient = useQueryClient();
	const queryKey = conversationKeys.list(user?.id)

	return useMutation({
		mutationFn: (param: { convId: number; newTitle: string }) =>
			conversationService.updateConversationTitle(param),

		onMutate: async (param: { convId: number; newTitle: string }) => {
			const {convId, newTitle} = param;
			
			await queryClient.cancelQueries({queryKey})

			const prev = queryClient.getQueryData(queryKey) as Conversation[]

			const target= prev.find(conv => conv.id === convId)

			if(!target) return {prev};

			const updatedConv = {
				...target,
				title: newTitle
			}

			const updated = prev.map(c =>
				c.id === convId ? updatedConv : c
			);

			queryClient.setQueryData(queryKey, updated);

			return { prev };
		},

		onError: (_err, _vars, context) => {
			queryClient.setQueryData(queryKey, context?.prev);
		},

		onSettled: () => {
				queryClient.invalidateQueries({ queryKey });
			}
	});
};

export const useDeleteConv = () => {
	const { user } = useAuthStore();

	const queryClient = useQueryClient();
	const queryKey = conversationKeys.list(user?.id)

	return useMutation({
		mutationFn: (convId: number) =>
			conversationService.deleteConversation(convId),


		onMutate: async (convId) => {
				await queryClient.cancelQueries({ queryKey });

				const prev = queryClient.getQueryData(queryKey);

				queryClient.setQueryData(conversationKeys.list(user?.id), (old: Conversation[]) =>
					old?.filter(c => c.id !== convId)
				);

				return { prev };
			},

			onError: (_err, _vars, context) => {
				queryClient.setQueryData(queryKey, context?.prev);
			},

			onSettled: () => {
				queryClient.invalidateQueries({ queryKey });
			}
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