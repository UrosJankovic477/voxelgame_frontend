import { mat4, vec4 } from "gl-matrix";
import { User } from "../models/user.model";

export interface AppState {
    loginState: LoginState,
    rendererState: RendererState,
    colorState: ColorState
};

export interface LoginState {
    token: string | null,
    user: User | null,
    errorMessage?: string
};

export interface RendererState {
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    program: WebGLProgram,
    programLinked: boolean,
};

export interface SculptureState {

};

export interface TransformState {
    projection: mat4,
    transform: mat4,
};

export interface ColorState {
    color: vec4;
};