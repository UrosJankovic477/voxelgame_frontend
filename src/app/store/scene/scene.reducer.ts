import { createReducer, on } from "@ngrx/store";
import { SceneState } from "../app.state";
import { sceneOpenForEdit, sceneOpenForView, sceneSave } from "./scene.actions";
import { Octree } from "../../models/webgl-models/octree.model";
import { state } from "@angular/animations";

export const initialSceneState: SceneState = {
    activeSceneJson: null,
    viewOnlySceneJson: null
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
    }))
);