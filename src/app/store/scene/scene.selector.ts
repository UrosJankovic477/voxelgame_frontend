import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectSceneActive = createSelector(
    (state: AppState) => state.sceneState,
    (state) => state.activeSceneJson
);

export const selectSceneViewOnly = createSelector(
    (state: AppState) => state.sceneState,
    (state) => state.viewOnlySceneJson
);

export const selectPreview = createSelector(
    (state: AppState) => state.sceneState,
    (state) => state.preview
);

export const selectPreviewLocal = createSelector(
    (state: AppState) => state.sceneState,
    (state) => state.previewLocal
);