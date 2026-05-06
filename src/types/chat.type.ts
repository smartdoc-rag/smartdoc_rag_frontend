import type { CursorPaginationParams } from "./common/pagination.type"

export type UserMessage = {
    id: number,
    conversation_id: number,
    content: string,
    created_at: Date,
    updated_at: Date,
}

//from history
export type BotMessage = { 
    response_id: number,
    type: 'rag' | 'graphrag',
    content: string,
    created_at: Date,
    citations: Citation[],
    word_count: number
    updated_at: Date,
}

export type Citation = {
    file_id: number
    file_name?: string,
    page: number
    chunk?: string
    marker?: string
    start_line: number,
    end_line: number
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
    request_id: number,
    question: string,
    created_at: Date,
    mode?: 'dual' | 'single',
    responses: BotMessage[],
    tempId?: string,
    isPending?: boolean
}

export type getHistoryParam = {convId?: number } & CursorPaginationParams