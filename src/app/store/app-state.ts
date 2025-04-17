import { User } from "../models/user.model";

export interface AppState {
    loginState: LoginState
};

export interface LoginState {
    token: string | null,
    user: User | null,
    errorMessage?: string
}