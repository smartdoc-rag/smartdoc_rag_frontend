import api from "@/lib/axios"
import type { AuthParams, LoginData, LoginResponse } from "@/types/auth.type";
import type { ApiResponse } from "@/types/common/response.type";
import type { UserResponse } from "@/types/user.type";

export const authService = {
    signUp: async ({email, password, fullName }: AuthParams ): Promise<boolean> => {
        const res = await api.post<ApiResponse<UserResponse>>('/auth/register', {
            email,
            password,
            full_name: fullName
        });

        const { success, data, message, error } = res.data;

        if (!success || !data) {
            throw new Error(error || message || "Đăng ký thất bại");
        }

        return success
    },

    signIn: async({email, password}: AuthParams): Promise<LoginData> => {
        const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
            email,
            password
        })

        const { success, data, message, error } = res.data;

        if (!success || !data) {
            throw new Error(error || message || "Đăng nhập thất bại");
        }

        return {
            user : {
                ...data.user,
                id: data.user.id.toString(),
                fullName: data.user.full_name,
                isActive: data.user.is_active
            },
            accessToken : data.access_token
        }
    },

    signOut: async() => {
        const res = await api.post("/auth/logout");
        return res.data
    },

    refresh: async() => {
        const res = await api.post <ApiResponse<{access_token: string}>>("/auth/reset-token");
        return res.data.data?.access_token
    },
}