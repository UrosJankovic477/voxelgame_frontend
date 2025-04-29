import { createSelector } from "@ngrx/store";
import { AppState } from "../app-state";

export const selectLoginToken = createSelector(
    (state: AppState) => state.loginState,
    (state) => state.token
);

export const selectLoginUser = createSelector(
    (state: AppState) => state.loginState,
    (state) => state.user
);

export const selectLoginErrorMessage = createSelector(
    (state: AppState) => state.loginState,
    (state) => state.errorMessage
);