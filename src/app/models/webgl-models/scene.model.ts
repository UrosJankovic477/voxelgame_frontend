import { vec3, vec4 } from "gl-matrix";
import { Camera } from "./camera.model";
import { Mesh } from "./mesh.model";
import { Sculpture } from "./sculpture.model";
import { SceneOptions } from "./scene-options.model";

export class Scene {
    private constructor(gl: WebGL2RenderingContext, size: number = 16, gridColor: string | [number, number, number, number] = 'CadetBlue') {
        this.grid = Mesh.generateGrid(gl, size, gridColor);
        this.size = size;
    }

    public static fromOptions(gl: WebGL2RenderingContext, options: SceneOptions) {
        const scene = new Scene(gl, options.size, options.gridColor);
        scene.sculpture = Sculpture.fromSize(options.size);
        return scene;
    }

    public static fromJson(gl: WebGL2RenderingContext, json: string) {
        const jsonParsed = JSON.parse(json);
        const scene = new Scene(gl, jsonParsed['_size']);
        scene.sculpture = Sculpture.fromParsedJson(jsonParsed);
        return scene;
    }

    camera: Camera = new Camera();
    grid: Mesh | null = null;
    sculpture: Sculpture | null = null;
    size: number = 16;

    public render(gl: WebGL2RenderingContext) {
        this.grid?.render(gl, gl.LINES);
        this.sculpture?.render(gl);
    }

    public load(gl: WebGL2RenderingContext) {
        this.grid?.load(gl);
    }
    
}