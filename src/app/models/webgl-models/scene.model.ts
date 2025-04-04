import { Camera } from "./camera.model";
import { Mesh } from "./mesh.model";
import { Sculpture } from "./sculpture.model";

export class Scene {
    constructor(gl: WebGL2RenderingContext, gridWidth: number = 16, gridColor: string | [number, number, number, number] = 'CadetBlue') {
        this.grid = Mesh.generateGrid(gl, gridWidth, gridColor)
    }

    camera: Camera = new Camera();
    grid: Mesh | null = null;
    sculpture: Sculpture | null = null;

    public render(gl: WebGL2RenderingContext) {
        this.grid?.render(gl, gl.LINES);
        this.sculpture?.render(gl);
    }

    public load(gl: WebGL2RenderingContext) {
        this.grid?.load(gl);
    }
    
}