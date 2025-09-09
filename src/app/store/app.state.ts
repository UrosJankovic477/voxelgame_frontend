import { createReducer } from "@ngrx/store";
import { UserModel } from "../models/user.model";
import { authReducer, initialAuthState } from "./auth/auth.reducer";
import { EntityState } from "@ngrx/entity";

export interface AppState {
    authState: AuthState,
    sceneState: SceneState
};

export interface AuthState {
    token: string | null,
    user: UserModel | null,
    errorMessage?: string
};

export interface SceneState {
    activeSceneJson: string | null;
    preview: Blob;
    previewLocal: string;
    viewOnlySceneJson: string | null;
};

export const initialState: AppState = JSON.parse(sessionStorage.getItem('state') ?? 'null') ?? {
    authState: initialAuthState
};
