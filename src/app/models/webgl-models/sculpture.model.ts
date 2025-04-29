import { vec3, vec4 } from "gl-matrix";
import { Mesh } from "./mesh.model";
import { Vertex } from "./vertex.model";
import { Octree, OctreeNode, OctreeNodeState } from "./octree.model";

export class Sculpture {
    constructor(size: number) {
        this.size = size;
        this.data = new Octree(size);


    }

    size: number;
    data?: Octree;
    mesh?: Mesh;
    private dirty: boolean = false;

    reset() {
        delete this.data;
        this.data = new Octree(this.size);
        delete this.mesh;
    }

    private static cubeVertices: {position: vec3, normal: vec3}[] = Sculpture.generatecCubeVertices();

    private static generatecCubeVertices(): {position: vec3, normal: vec3}[] {
        
        const faces: vec3[][] = [];
        let coordToChange = 0;

        function generateHalfCube(bottom: boolean) {
            const direction = bottom ? ((x: number) => 2 - x) : ((x: number) => x);
            const vertex = bottom ? vec3.fromValues(0, 0, 0) : vec3.fromValues(1, 1, 1);
            const face = [];
            for (let i = 0; i < 18; i++) {
                face.push(vertex.slice() as vec3);
                if ((i + 1) % 3 !== 0) {
                    vertex[direction(coordToChange)] = 1 - vertex[direction(coordToChange)]; 
                }
                else{
                    faces.push(face.slice());
                    face.length = 0;
                    if ((i + 1) % 2 === 0) {
                        coordToChange = (coordToChange + 1) % 3;
                    }
                } 
                coordToChange = (coordToChange + 1) % 3;  
            }
        }
        generateHalfCube(true);
        generateHalfCube(false);

        return faces.reduce<{position: vec3, normal: vec3}[]>((vertices, face) => {
            const normal = vec3.create();
            const u = vec3.create();
            const v = vec3.create();
            vec3.sub(u, face[1], face[0]);
            vec3.sub(v, face[2], face[0]);
            vec3.cross(normal, u, v);
            vec3.normalize(normal, normal);
            vertices.push(
                {
                    position: face[0],
                    normal
                },
                {
                    position: face[1],
                    normal
                },
                {
                    position: face[2],
                    normal
                }
            );
            return vertices;
        }, [])
    }

    private generateMesh(gl: WebGL2RenderingContext) {   
        const vertices = this.data!.blocks
        .map((colorAndState, index) => ({ ...colorAndState, index }))
        .filter(blockOrEmpty => blockOrEmpty.state != OctreeNodeState.empty)
        .flatMap((block) => {
            return Sculpture.cubeVertices.map(cubeVertex => {
                const position = vec3.create();
                
                return {
                    position: vec3.add(
                        position, 
                        cubeVertex.position, 
                        [
                            block.index % this.size - this.size / 2, 
                            Math.floor(block.index / this.size) % this.size, 
                            Math.floor(block.index / (this.size * this.size)) - this.size / 2
                        ]),
                    color: block.color!,
                    normal: cubeVertex.normal
                };
            });
        });
        delete this.mesh;
        if (vertices.length > 0) {
            this.mesh = new Mesh(gl, vertices);
        }
        this.mesh?.load(gl);
        this.dirty = false;
    }

    public placeBlock(position: vec3, color: vec4) {
        vec3.add(position, position, [this.size / 2, 0, this.size / 2]);
        this.data!.placeBlock(position[0], position[1], position[2], color);
        this.dirty = true;
    }

    public removeBlock(position: vec3) {
        vec3.add(position, position, [this.size / 2, 0, this.size / 2]);
        this.data!.removeBlock(position[0], position[1], position[2]);
        this.dirty = true;
    }

    public render(gl: WebGL2RenderingContext) {
        if (this.dirty) {
            this.generateMesh(gl);
        }
        this.mesh?.render(gl, gl.TRIANGLES);
    }
}