import { mat4, vec2, vec3, vec4 } from "gl-matrix";

export class Camera {
    constructor() {
        this.translationMatrix = mat4.create();
        mat4.fromTranslation(this.translationMatrix, vec3.fromValues(400, 300, 400));
        this.rotationMatrix = mat4.create();
        this.rotation = vec2.fromValues(Math.PI / 4, Math.PI / 4);
        mat4.fromXRotation(this.rotationMatrix, this.rotation[0]);
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, this.rotation[1]);
        this.scaleMatrix = mat4.create();
        this.zoom = 25;
        mat4.fromScaling(this.scaleMatrix, vec3.fromValues(this.zoom, this.zoom, this.zoom));
        this.transform();
    }
    private zoom: number = 1.0;
    private rotation: vec2;

    private translationMatrix: mat4;
    private rotationMatrix: mat4;
    private scaleMatrix: mat4;

    public transformMatrix: mat4 = mat4.create();

    private transform() {
        mat4.mul(this.transformMatrix, this.rotationMatrix, this.scaleMatrix);
        mat4.mul(this.transformMatrix, this.translationMatrix, this.transformMatrix);   
    }

    public translate(dx: number, dy: number) { 
        mat4.translate(this.translationMatrix, this.translationMatrix, vec3.fromValues(dx, dy, 0.0));
        this.transform();
    }
    
    public rotate(rotation: vec2) {
        vec2.add(this.rotation, this.rotation, rotation);
        this.rotation[1] = this.rotation[1] % (Math.PI * 2);
        this.rotation[0] = Math.min(this.rotation[0], Math.PI / 2 - 0.1);
        this.rotation[0] = Math.max(this.rotation[0], -Math.PI / 2 + 0.1);

        mat4.fromXRotation(this.rotationMatrix, this.rotation[0]);
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, this.rotation[1]);

        this.transform();
    }

    public scale(factor: number) {
        this.zoom = Math.max(10, Math.min(100, this.zoom + factor / (200 - this.zoom)));
        console.log(this.zoom);
        mat4.fromScaling(this.scaleMatrix, vec3.fromValues(this.zoom, this.zoom, this.zoom));
        this.transform();
    }

}