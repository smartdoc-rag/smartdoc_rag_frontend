import api from "@/lib/axios"
import type { AskParams, getHistoryParam, HistoryMessage } from "@/types/chat.type"
import type { CursorResponse } from "@/types/common/pagination.type"
import type { ApiResponse } from "@/types/common/response.type"

export const chatService = {
    ask: async(askParams: AskParams): Promise<HistoryMessage> => {
        
        const {convId, isRerank, isSelfRag, responseType, searchType, selectedFiles, question, topK} = askParams

        const res = await api.post<ApiResponse<HistoryMessage>>(`/chat/${convId}/ask/`, {
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

    getHistory: async(param: getHistoryParam): Promise<CursorResponse<HistoryMessage>> => {
        const { convId, limit, cursor } = param;
		const params = new URLSearchParams();

		if (cursor) params.append("cursor", cursor);
		params.append("limit", limit.toString());

        const res = await api.get<ApiResponse<CursorResponse<HistoryMessage>>>(`/chat/${convId}/history?${params.toString()}`)
        const {message, data, success, error} = res.data

        if (error || !success || !data) {
            throw new Error(error || message)
        }
        console.log(data)
        return data
    }
}