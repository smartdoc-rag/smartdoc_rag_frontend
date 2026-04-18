import type { User, UserResponse } from "./user.type";

export type AuthParams = {
    email: string,
    password: string, 
    fullName?: string,
}

export type LoginData = {
    user: User,
    accessToken: string
}

export type LoginResponse = {
    user: UserResponse,
    access_token: string
}
