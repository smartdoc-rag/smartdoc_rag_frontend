import { chatService } from "@/services/chat.service"
import type { AskParams, BotResponse, HistoryMessage } from "@/types/chat.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const chatQueryKeys = {
  all: ['history'] as const,
  list: (convId?: number) => ['history', convId] as const,
}
export const useGetHistory = (convId?: number) => {
  return useQuery({
    queryKey: chatQueryKeys.list(convId),
    queryFn: () => chatService.getHistory(convId),
    enabled: !!convId,
  })
}


export const useAsk = (convId?: number) => {
  const queryClient = useQueryClient()
  const queryKey = chatQueryKeys.list(convId)

  return useMutation({
    mutationFn: async (param: AskParams): Promise<HistoryMessage> => {
  const res: BotResponse = await chatService.ask(param)

    return {
        request_id: res.response_id,
        question: param.question || '',
        answer: res.answer,
        created_at: new Date().toLocaleDateString(),
    }
    },

    onMutate: async (param: AskParams) => {
      await queryClient.cancelQueries({ queryKey })

      const prev = queryClient.getQueryData<HistoryMessage[]>(queryKey)

      const tempId = crypto.randomUUID()

      const fakeMessage: HistoryMessage = {
        request_id: 0,
        question: param.question || "",
        answer: "",
        created_at: new Date().toLocaleDateString(),
        tempId: crypto.randomUUID(),
        pending: true,
      }

      queryClient.setQueryData(queryKey, (old: HistoryMessage[] = []) => [
        ...old,
        fakeMessage,
      ])

      return { prev, tempId }
    },

    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev)
      }
    },

    onSuccess: (data: HistoryMessage, _vars, context) => {
      queryClient.setQueryData(queryKey, (old: HistoryMessage[] = []) =>
        old.map((msg) =>
          msg.tempId === context?.tempId
            ? {
                ...data,
                pending: false,
              }
            : msg
        )
      )
    },
  })
}