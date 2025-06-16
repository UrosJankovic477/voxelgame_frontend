import { ActionReducer, MetaReducer } from "@ngrx/store";
import { AuthState as AuthState } from "./app.state";

export function saveState(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        const newState = reducer(state, action);
        sessionStorage.setItem('state', JSON.stringify(newState));
        return newState;
    };
}

export const metaReducers: MetaReducer<any>[] = [saveState];