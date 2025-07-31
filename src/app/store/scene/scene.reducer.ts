import { createReducer, on } from "@ngrx/store";
import { SceneState } from "../app.state";
import { sceneOpenForEdit, sceneOpenForView, sceneReset, sceneSave, sceneSavePreview } from "./scene.actions";

export const initialSceneState: SceneState = {
    activeSceneJson: null,
    viewOnlySceneJson: null,
    preview: new Blob(),
    previewLocal: '',
};

export const sceneReducer = createReducer(
    initialSceneState,
    on(sceneSave, (state, {sceneJson}) => {
        return {
            ...state,
            activeSceneJson: sceneJson,
            viewOnlySceneJson: null
        };
    }),
    on(sceneOpenForView, (state, { sceneJson }) => ({
        ...state,
        viewOnlySceneJson: sceneJson
    })),
    on(sceneOpenForEdit, (state, { sceneJson }) => ({
        ...state,
        activeSceneJson: sceneJson,
    })),
    on(sceneSavePreview, (state, { preview, previewLocal }) => ({
        ...state,
        preview: preview,
        previewLocal: previewLocal
    })),
    on(sceneReset, state => initialSceneState)
);