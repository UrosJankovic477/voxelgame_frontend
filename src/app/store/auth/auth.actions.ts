import { createAction, props } from "@ngrx/store";
import { UserDto } from "../../dto/user.dto";
import { User } from "../../models/user.model";
import { LoginResault } from "../../models/login-resault.model";

export const loginRequest = createAction(
    '[Auth] Login Request', 
    props<{
        username: string,
        password: string,
    }>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<LoginResault>()
);

export const loginFailure = createAction(
    '[Auth] Login Failiure',
    props<{ errorMessage: string }>()
);

export const logout = createAction('[Auth] Logout');
