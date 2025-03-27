import { quat, vec4 } from "gl-matrix";

export class Camera {
    constructor() {

    }
    zoom: number = 1.0;
    rotation: quat = quat.create();
    
    public rotate(angleX: number, angleY: number) {
        quat.rotateX(this.rotation, this.rotation, angleX);
        quat.rotateY(this.rotation, this.rotation, angleY);
    }

}