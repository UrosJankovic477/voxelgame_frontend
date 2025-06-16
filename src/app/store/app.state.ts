import { createReducer } from "@ngrx/store";
import { User } from "../models/user.model";
import { authReducer, initialAuthState } from "./auth/auth.reducer";

export interface AppState {
    authState: AuthState,
    rendererState?: RendererState,
};

export interface AuthState {
    token: string | null,
    user: User | null,
    errorMessage?: string
};

export interface RendererState {
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    program: WebGLProgram,
    programLinked: boolean,
};

export const initialState: AppState = JSON.parse(sessionStorage.getItem('state') ?? 'null') ?? {
    authState: initialAuthState
};
