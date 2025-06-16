import { Action, createReducer, on } from "@ngrx/store";
import { User } from "../../models/user.model";
import { loginFailure, loginSuccess, logout } from "./auth.actions";
import { AppState, AuthState } from "../app.state";

export const initialAuthState: AuthState = {
    token: null,
    user: null,
};

export const authReducer = createReducer(
    initialAuthState,
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
    on(logout, (state) => initialAuthState)
);
