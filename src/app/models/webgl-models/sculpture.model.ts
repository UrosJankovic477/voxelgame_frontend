import { Mesh } from "./mesh.model";
import { Vertex } from "./vertex.model";

export class Sculpture {
    constructor(size: number) {
        this.size = size;
        this.sculptureData = new Array<Vertex | null>(size * size * size);
    }

    size: number;
    sculptureData: Array<Vertex | null>;
    sculputreMesh: Mesh | null = null;

    reset() {
        this.sculptureData.fill(null);
    }

    generateMesh() {

    }

    public render(gl: WebGL2RenderingContext) {

    }
}