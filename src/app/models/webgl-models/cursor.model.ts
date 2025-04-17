import { vec2, vec3, vec4 } from "gl-matrix";
import { Sculpture } from "./sculpture.model";

export class Cursor {
    position: vec4 = vec4.fromValues(0, 0, 0, 1);
    
    testCollision(gridWidth: number, sculpture: Sculpture) {
        let voxel = this.testSculputre(sculpture);
        if (voxel === null) {
            voxel = this.testGrid(gridWidth);
        }
    }

    testGrid(gridWidth: number): vec3 | null {

        return null;
    }

    testSculputre(sculpture: Sculpture): vec3 | null {
        

        return null;
    }
}