
export type Conversation = {
    id: number,
    title: string,
    created_at: Date,
    last_chat_at: Date,
    chunk_size: number,
    chunk_overlap: number
}

export type ConversationConfigParam = Pick<Conversation, 'id' | 'chunk_overlap' | 'chunk_size'>
