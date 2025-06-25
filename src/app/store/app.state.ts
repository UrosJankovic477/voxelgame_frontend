import { createReducer } from "@ngrx/store";
import { User } from "../models/user.model";
import { authReducer, initialAuthState } from "./auth/auth.reducer";
import { Octree } from "../models/webgl-models/octree.model";

export interface AppState {
    authState: AuthState,
    sceneState: SceneState
};

export interface AuthState {
    token: string | null,
    user: User | null,
    errorMessage?: string
};

export interface SceneState {
    activeSceneJson: string | null;
    viewOnlySceneJson: string | null;
};

export const initialState: AppState = JSON.parse(sessionStorage.getItem('state') ?? 'null') ?? {
    authState: initialAuthState
};
