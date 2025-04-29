import { mat4, vec2, vec3, vec4 } from "gl-matrix";

export class Camera {
    constructor() {
        this.translationMatrix = mat4.create();
        mat4.fromTranslation(this.translationMatrix, vec3.fromValues(300, 400, 300));
        this.rotationMatrix = mat4.create();
        this._rotation = vec2.fromValues(Math.PI / 4, Math.PI / 4);
        mat4.fromXRotation(this.rotationMatrix, this._rotation[0]);
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, this._rotation[1]);
        this.scaleMatrix = mat4.create();
        this._zoom = 25;
        mat4.fromScaling(this.scaleMatrix, vec3.fromValues(this._zoom, this._zoom, this._zoom));
        this.transform();
    }
    private _zoom: number = 1.0;
    private _rotation: vec2;
    
    
    public get rotation() : Readonly<vec2> {
        return this._rotation;
    }
    
    
    public get zoom() : number {
        return this._zoom;
    }

    public get inverseTransform(): mat4 {
        const inverseTransform = mat4.create();
        const inverseTranslation = mat4.clone(this.translationMatrix);
        const inverseRotation = mat4.clone(this.rotationMatrix);
        const inverseScale = mat4.clone(this.scaleMatrix);
        //mat4.rotateY(inverseRotation, inverseRotation, Math.PI);
        mat4.invert(inverseTranslation, inverseTranslation);
        mat4.invert(inverseRotation, inverseRotation);
        mat4.invert(inverseScale, inverseScale);
        mat4.mul(inverseTransform, inverseScale, inverseRotation);
        mat4.mul(inverseTransform, inverseTransform, inverseTranslation);
        return inverseTransform;
    }

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
        vec2.add(this._rotation, this._rotation, rotation);
        this._rotation[1] = this._rotation[1] % (Math.PI * 2);
        this._rotation[0] = Math.min(this._rotation[0], Math.PI / 2 - 0.1);
        this._rotation[0] = Math.max(this._rotation[0], 0.1);

        mat4.fromXRotation(this.rotationMatrix, this._rotation[0]);
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, this._rotation[1]);

        this.transform();
    }

    public scale(factor: number) {
        this._zoom = Math.max(10, Math.min(100, this._zoom + factor / (200 - this._zoom)));
        mat4.fromScaling(this.scaleMatrix, vec3.fromValues(this._zoom, this._zoom, this._zoom));
        this.transform();
    }

}