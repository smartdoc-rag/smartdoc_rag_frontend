import { fileService } from "@/services/file.service"
import { useAuthStore } from "@/stores/useAuthStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUploadFile = () => {
    const queryClient = useQueryClient()
    const {user} = useAuthStore()

    return useMutation({
        mutationFn: ({conversationId, formData} 
            : {conversationId: number, formData: FormData,}) => fileService.uploadFiles(conversationId, formData),
        
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['conversations', user?.id]}),
    })
}