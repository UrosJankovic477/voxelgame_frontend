import { Action, createReducer, on } from "@ngrx/store";
import { User } from "../models/user.model";
import { loginFailure, loginSuccess, logout } from "./auth.actions";
import { AppState, LoginState } from "./app-state";

export const initialState: LoginState = {
    token: null,
    user: null,
};

export const authReducer = createReducer(
    initialState,
    on(loginSuccess, (state, loginResault ) => ({
        ...state,
        token: loginResault.access_token,
        user: loginResault.user,
        errorMessage: undefined
    })),
    on(loginFailure, (state, { errorMessage }) => ({
        ...state,
        errorMessage: errorMessage
    })),
    on(logout, (state) => initialState)
);
