import { vec3, vec4 } from "gl-matrix";

export interface Vertex {
    position: vec3;
    normal: vec3;
    color: vec4;
}