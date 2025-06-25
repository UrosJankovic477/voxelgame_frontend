import { createAction, props } from "@ngrx/store";
import { SceneState } from "../app.state";
import { Octree } from "../../models/webgl-models/octree.model";

export const sceneSave = createAction(
    '[Scene] Scene Save',
    props<{ sceneJson: string }>()
);

export const sceneOpenForView = createAction(
    '[Scene] Scnene Open For View',
    props<{ sceneJson: string }>()
);

export const sceneOpenForEdit = createAction(
    '[Scene] Scene Open For Edit',
    props<{ sceneJson: string }>()
);