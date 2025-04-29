import { vec3, vec4 } from "gl-matrix";
import { Camera } from "./camera.model";
import { Mesh } from "./mesh.model";
import { Sculpture } from "./sculpture.model";

export class Scene {
    constructor(gl: WebGL2RenderingContext, private _size: number = 16, gridColor: string | [number, number, number, number] = 'CadetBlue') {
        this.grid = Mesh.generateGrid(gl, _size, gridColor);
        this.sculpture = new Sculpture(_size);
    }

    camera: Camera = new Camera();
    grid: Mesh | null = null;
    sculpture: Sculpture | null = null;

    public get size(): Readonly<number> {
        return this._size;
    }

    public render(gl: WebGL2RenderingContext) {
        this.grid?.render(gl, gl.LINES);
        this.sculpture?.render(gl);
    }

    public load(gl: WebGL2RenderingContext) {
        this.grid?.load(gl);
    }
    
}