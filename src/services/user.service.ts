import api from "@/lib/axios";
import type { ApiResponse } from "@/types/common/response.type";
import type { User, UserResponse } from "@/types/user.type";

export const userService = {
    fetchUser: async (): Promise<User> => {
        const res = await api.get<ApiResponse<UserResponse>>('/auth/me')

        const { success, data, message, error } = res.data;
        
        if (!success || !data) {
            throw new Error(error || message || "Lấy thông tin user thất bại");
        }

        return {
            ...data,
            id: data.id.toString(),
            isActive: data.is_active,
            fullName: data.full_name
        }
    },
}