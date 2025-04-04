import { mat4, vec2, vec3 } from "gl-matrix";
import { Camera } from "./camera.model";
import { Scene } from "./scene.model";
import { Mesh } from "./mesh.model";
import { vertexShader } from '../../shaders/vertex.shader';
import { fragmentShader } from '../../shaders/fragment.shader';
import { SceneOptions } from "./scene-options.model";
import rgba from "color-rgba";

export class Renderer {
  constructor(
      private canvas: HTMLCanvasElement,
      sceneOptions: SceneOptions 
  ) {

    this.gl = this.canvas.getContext('webgl2');
    if (this.gl === null) {
      throw new Error('Failed to initialize WebGL rendering context');
    }
    let backgroundColor = typeof(sceneOptions.backgroundColor) === 'string' ? rgba(sceneOptions.backgroundColor) : sceneOptions.backgroundColor;
    if (backgroundColor === undefined || backgroundColor.length == 0) {
      backgroundColor = [0, 0, 0, 1];
    }
    this.gl.clearColor(...backgroundColor);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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
    
    this.scene = new Scene(this.gl, sceneOptions.gridWidth, sceneOptions.gridColor);
    this.gl?.uniformMatrix4fv(this.modelMatrixUniformLocation, false, this.scene?.camera.transformMatrix!);
  }

  gl: WebGL2RenderingContext | null = null;
  vertexShader: WebGLShader | null = null;
  fragmentShader: WebGLShader | null = null;
  program: WebGLProgram | null = null;
  scene: Scene | null = null;

  modelMatrix: mat4 = mat4.create();
  projectuonMatrix: mat4 = mat4.create();

  modelMatrixUniformLocation: WebGLUniformLocation | null = null;
  projectionMatrixUniformLocation: WebGLUniformLocation | null = null;

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
    this.gl!.clear(this.gl!.COLOR_BUFFER_BIT);
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
}