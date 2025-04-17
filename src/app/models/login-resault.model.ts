import { User } from "./user.model"

export interface LoginResault {
    access_token: string,
    user: User
}