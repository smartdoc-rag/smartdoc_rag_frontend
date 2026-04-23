
export type UserMessage = {
    id: number,
    conversation_id: number,
    content: string,
    created_at: Date,
    updated_at: Date,
}

export type BotMessage = {
    id: number,
    request_message_id: number,
    content: string,
    type: string,
    created_at: Date,
    updated_at: Date,
}

export type Citation = {
    file_id: number
    file_name?: string
    chunk_id?: string
    content?: string
    score?: number
}

export type BotResponse = {
    request_id: number
    response_id: number
    answer: string
    citations: Citation[]
    confidence: number | null
    rewritten_query: string | null
}

export type AskParams = {
    convId: number,
    question ?: string,
    searchType ?: string,
    selectedFiles?: number[],
    responseType ?: string,
    isRerank ?: boolean,
    topK ?: number,
    isSelfRag ?: boolean
}

export type HistoryMessage = {
  request_id: number
  tempId?: string

  question: string
  answer: string

  created_at: string

  pending?: boolean
}
