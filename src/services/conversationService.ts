import api from "@/lib/axios"
import type { Conversation } from "@/types/conversation.type"

export const conversationService = {
    createConversation: async(title: string): Promise<Conversation> => {
        try{
            const res = await api.post<Conversation>('/conversation/create', {title})
            return res.data
        } catch(error) {
            console.error(error)
            throw new Error("Lỗi khi tạo đoạn chat mới")
        }
    },

    getAllConversations: async(): Promise<Conversation[]> => {
        try{
            const res = await api.get<{items: Conversation[]}>('/conversation')
            return res.data.items
        } catch (error) {
            console.error(error)
            throw new Error("Lỗi khi tạo đoạn chat mới")
        }
    },

    updateConservationTitle: async({convId, newTitle} : {convId: number, newTitle: string}) => {
        try{
            const res = await api.put(`/conversation/${convId}/title`, {title: newTitle})
            return res.data
        } catch(error) {
            console.error(error)
            throw new Error("Lỗi khi sửa tên đoạn chat")
        }
    },

    updateLastChat: async(convId: number) => {
        try {
            const res = await api.patch(`/conversation/${convId}/last-chat`)
            return res.data
        } catch(error) {
            console.error(error)
            throw new Error("Lỗi khi cập nhật last chat")
        }
    },

    deleteConversation: async(convId: number) => {
        try{
            const res = await api.delete(`/conversation/${convId}`)
            return res.data
        } catch(error) {
            console.error(error)
            throw new Error("Lỗi khi xóa hội thoại")
        }
    }
    
}