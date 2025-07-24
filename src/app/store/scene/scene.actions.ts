import { createAction, props } from "@ngrx/store";

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

export const sceneSavePreview = createAction(
    '[Scene] Scene Save Preview',
    props<{ preview: Blob, previewLocal: string }>()
)