import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Camera } from "./camera";
import { Scene } from "./scene";
import { Mesh } from "./mesh";
import { vertexShader } from '../shaders/vertex.shader';
import { fragmentShader } from '../shaders/fragment.shader';
import { SceneOptions } from "./scene-options";
import rgba from "color-rgba";
import { CollisionData } from "./octree";
import { Sculpture } from "./sculpture";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.state";
import { selectSceneActive, selectSceneViewOnly } from "../store/scene/scene.selector";
import { sceneSave } from "../store/scene/scene.actions";

export class Renderer {
  constructor(
      private canvas: HTMLCanvasElement,
      private store: Store<AppState>,
      sceneOptions: SceneOptions 
  ) {
    this.sceneOptions = sceneOptions;
    this.gl = this.canvas.getContext('webgl2');
    if (this.gl === null) {
      throw new Error('Failed to initialize WebGL rendering context');
    }
    let backgroundColor = typeof(sceneOptions.backgroundColor) === 'string' ? rgba(sceneOptions.backgroundColor) : sceneOptions.backgroundColor;
    if (backgroundColor === undefined || backgroundColor.length == 0) {
      backgroundColor = [0, 0, 0, 1];
    }
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(...backgroundColor);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShader);
    this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShader);
    this.program = this.gl.createProgram();
    if (this.program === null) {
      throw new Error('Failed to create WebGL program');
    }
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);
    this.gl.linkProgram(this.program);
    const programStatus = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (!programStatus) {
      const infoLog = this.gl.getProgramInfoLog(this.program);
      this.gl.deleteProgram(this.program);
      throw new Error(`${infoLog}`);
    }
    this.gl.useProgram(this.program);
    this.modelMatrixUniformLocation = this.gl.getUniformLocation(this.program, 'modelMat');
    this.projectionMatrixUniformLocation = this.gl.getUniformLocation(this.program, 'projectionMat');

    this.createScene(sceneOptions);
  }

  createScene(sceneOptions: SceneOptions) {
    this.sceneOptions = {
      ...this.sceneOptions,
      ...sceneOptions
    };
    if (!!this.sceneOptions.scene) {
      this.scene = Scene.fromJson(this.gl!, this.sceneOptions.scene);
    }

    else {
      this.store.select(selectSceneActive).subscribe(sceneJson => {
        if (sceneJson !== null) {
          this.scene = Scene.fromJson(this.gl!, sceneJson);
        }
        else {
          this.scene = Scene.fromOptions(this.gl!, this.sceneOptions);
        }
      });
    }
    
    this.gl?.uniformMatrix4fv(this.modelMatrixUniformLocation, false, this.scene?.camera.transformMatrix!);
    this.loadScene();
    this.render();
  }

  gl: WebGL2RenderingContext | null = null;
  vertexShader: WebGLShader | null = null;
  fragmentShader: WebGLShader | null = null;
  program: WebGLProgram | null = null;
  scene: Scene | null = null;
  sceneOptions: SceneOptions;

  modelMatrix: mat4 = mat4.create();
  projectuonMatrix: mat4 = mat4.create();

  modelMatrixUniformLocation: WebGLUniformLocation | null = null;
  projectionMatrixUniformLocation: WebGLUniformLocation | null = null;

  saveScene() {
    const octree = this.scene?.sculpture?.data;
    const sceneJson = JSON.stringify(octree, (key, value) => {
      const ignore = new Set(['parent', 'leaves', '_depth', 'offset']);
      if (ignore.has(key)) {
        return null;
      }
      else return value;
  });
    this.store.dispatch(sceneSave({ sceneJson }));
  }

  loadShader(type: GLenum, shaderSource: string): WebGLShader {
    const shader = this.gl!.createShader(type);
    if (shader === null) {
      throw new Error('Unable to create shader object');
    }
    this.gl?.shaderSource(shader, shaderSource);
    this.gl?.compileShader(shader);
    const shaderStatus = this.gl?.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (!shaderStatus) {
      const infoLog = this.gl?.getShaderInfoLog(shader);
      console.log(shaderSource);
      throw new Error(`${infoLog}`);
      
    }
    return shader;
  }

  resizeCanvas() {
    if (this.canvas?.clientWidth !== this.canvas?.width || this.canvas?.clientHeight !== this.canvas?.height) {
      this.canvas!.width = this.canvas!.clientWidth;
      this.canvas!.height = this.canvas!.clientHeight;
    }
  }

  public render() {
    this.resizeCanvas();
    this.gl!.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    mat4.ortho(this.projectuonMatrix, 0, this.canvas!.width, 0, this.canvas!.height, 1000, -1000);
    this.gl!.uniformMatrix4fv(this.projectionMatrixUniformLocation, false, this.projectuonMatrix);
    this.gl!.clear(this.gl!.COLOR_BUFFER_BIT | this.gl!.DEPTH_BUFFER_BIT);
    this.scene!.render(this.gl!);
  }

  translateCamera(dx: number, dy: number) {
    this.scene!.camera.translate(dx, dy);
    this.gl?.uniformMatrix4fv(this.modelMatrixUniformLocation, false, this.scene?.camera.transformMatrix!);
    this.render();
  }

  rotateCamera(angleX: number, angleY: number) {
    this.scene!.camera.rotate(vec2.fromValues(angleX, angleY));
    this.gl?.uniformMatrix4fv(this.modelMatrixUniformLocation, false, this.scene?.camera.transformMatrix!);
    this.render();
  }

  zoomCamera(factor: number) {
    this.scene!.camera.scale(factor);
    this.gl?.uniformMatrix4fv(this.modelMatrixUniformLocation, false, this.scene?.camera.transformMatrix!);
    this.render();
  }

  public loadScene() {
    this.scene?.load(this.gl!);
  }

  public testCollision(cursorX: number, cursorY: number) {

    /**
     * convert cursor coords to world
     */
    
    const start = vec4.fromValues(cursorX, cursorY, 4096, 1);
    const end = vec4.fromValues(cursorX, cursorY, 4096 - 1, 1);

    const rotation = mat4.create();
    mat4.fromYRotation(rotation, Math.PI);

    //mat4.invert(transform, this.scene!.camera.transformMatrix);

    const transform = this.scene!.camera.inverseTransform;

    vec4.transformMat4(start, start, transform);
    vec4.transformMat4(end, end, transform);
    
    vec4.mul(start, start, [-1, 1, -1, 1]);
    vec4.mul(end, end, [-1, 1, -1, 1]);

    vec4.transformMat4(start, start, rotation);
    vec4.transformMat4(end, end, rotation);

    const delta = vec4.create();

    vec4.sub(delta, end, start);
    
    const collisionData = this.testCollisionSculpture(start, delta);

    if (!collisionData.collision) {
      return this.testCollisionGrid(start, delta);
    }
    else {
      return collisionData;
    }
    
  }

  private testCollisionSculpture(start: vec4, delta: vec4) {
    const sculpture = this.scene?.sculpture;
    return sculpture!.data!.testCollision(start, delta);
  }

  private testCollisionGrid(start: vec4, delta: vec4): CollisionData {
    /**
     * line(t) = start + delta * t
     * line crosses plane y = 0 at t = -start.y / end.y
     */
    const t = -start[1] / delta[1];
    const intersection = vec4.create(); // point of intersection with the y = 0 plane
    vec4.scaleAndAdd(intersection, start, delta, t);
    vec4.add(intersection, intersection, [Number.EPSILON * 100, Number.EPSILON * 100, Number.EPSILON * 100, 0]);
    return {
      collision: true,
      delta,
      intersection,
      t
    };
  }

  public changeBlock(position: vec3, color: vec4 | null) {
    if (color) {
      this.scene?.sculpture?.placeBlock(position, color);
    }
    else {
      this.scene?.sculpture?.removeBlock(position);
    }
    this.render();
  }
}