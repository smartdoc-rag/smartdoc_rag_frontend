import api from "@/lib/axios"
import type { AskParams, BotResponse, HistoryMessage } from "@/types/chat.type"
import type { ApiResponse } from "@/types/common/response.type"

export const chatService = {
    ask: async(askParams: AskParams): Promise<BotResponse> => {
        
        const {convId, isRerank, isSelfRag, responseType, searchType, selectedFiles, question, topK} = askParams

        const res = await api.post<ApiResponse<BotResponse>>(`/chat/${convId}/ask/`, {
            question,
            selected_file_ids: selectedFiles,
            response_type: responseType,
            search_type: searchType,
            use_reranking: isRerank,
            top_k : topK,
            use_self_rag: isSelfRag
        })

        const {message, data, success, error} = res.data

        if (error || !success || !data) {
            throw new Error(error || message)
        }

        return data
    },

    getHistory: async(convId?: number) => {
        const res = await api.get<ApiResponse<{history: HistoryMessage[]}>> (`/chat/${convId}/history?page_size=100`)
        const {message, data, success, error} = res.data

        if (error || !success || !data) {
            throw new Error(error || message)
        }

        return data.history
    }
}