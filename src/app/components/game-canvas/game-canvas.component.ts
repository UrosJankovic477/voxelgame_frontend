import { HttpClient } from '@angular/common/http';
import { Component, HostListener, model, OnInit } from '@angular/core';
import { vertexShader } from '../../shaders/vertex.shader';
import { fragmentShader } from '../../shaders/fragment.shader';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { Mesh } from '../../models/webgl-models/mesh.model';
import { Camera } from '../../models/webgl-models/camera.model';
import rgba from 'color-rgba';


// refactor: separate render related code from component class

@Component({
  selector: 'app-game-canvas',
  standalone: true,
  imports: [],
  templateUrl: './game-canvas.component.html',
  styleUrl: './game-canvas.component.css'
})
export class GameCanvasComponent implements OnInit {

  constructor(private client: HttpClient) {
    this.projectuonMatrix = mat4.create();
  }

  canvas: HTMLCanvasElement | null = null;
  gl: WebGL2RenderingContext | null = null;
  vertexShader: WebGLShader | null = null;
  fragmentShader: WebGLShader | null = null;
  program: WebGLProgram | null = null;

  modelMatrix: mat4 = mat4.create();
  viewMatrix: mat4 = mat4.create();
  projectuonMatrix: mat4;

  modelViewMatrixUniformLocation: WebGLUniformLocation | null = null;
  projectionMatrixUniformLocation: WebGLUniformLocation | null = null;

  grid: Mesh | null = null;
  build: Mesh | null = null;

  camera: Camera = new Camera();

  rotateCamera(angleX: number, angleY: number) {
    angleX = angleX / 180 * Math.PI; 
    angleY = angleY / 180 * Math.PI; 
    this.camera.rotate(angleX, angleY);
    const rotation: mat4 = mat4.create();
    const translation: mat4 = mat4.create();
    const scale: mat4 = mat4.create();
    mat4.fromScaling(scale, vec3.fromValues(25, 25, 25));
    mat4.fromTranslation(translation, vec3.fromValues(400, 300, 400))
    mat4.fromQuat(rotation, this.camera.rotation);
    mat4.mul(this.modelMatrix, rotation, scale);
    mat4.mul(this.modelMatrix, translation, this.modelMatrix)
    this.gl?.uniformMatrix4fv(this.modelViewMatrixUniformLocation, false, this.modelMatrix)
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

  generateGrid(width: number = 16, cssColorString: string = 'CadetBlue') {
    // generate vertex positions and colors

    const vertices: Array<vec4> = new Array<vec4>((width + 1) * 4);
    const colors: Array<vec4> = new Array<vec4>((width + 1) * 4);
    const rgbaColor = rgba(cssColorString);
    if (rgbaColor.length != 4) {
      throw new Error('Invalid grid color.');
    }

    rgbaColor[3] = rgbaColor[3] * 255;

    colors.fill(rgbaColor);
    const gridEnd = width / 2;
    
    for (let i = 0; i < width + 1; i++) {
      const position = i - gridEnd;
      vertices[4 * i] = [position, 0, gridEnd, 1]; 
      vertices[4 * i + 1] = [position, 0, -gridEnd, 1]; 
      vertices[4 * i + 2] = [gridEnd, 0, position, 1]; 
      vertices[4 * i + 3] = [-gridEnd, 0, position, 1]; 
    }
    vertices.forEach((vertex) => {
    });

    this.grid = new Mesh(this.gl!, vertices, colors);
    this.grid.load(this.gl!);
  }

  resizeCanvas() {
    if (this.canvas?.clientWidth !== this.canvas?.width || this.canvas?.clientHeight !== this.canvas?.height) {
      this.canvas!.width = this.canvas!.clientWidth;
      this.canvas!.height = this.canvas!.clientHeight;
    }
  }

  render() {
    //this.resizeCanvas();

    this.gl!.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    mat4.ortho(this.projectuonMatrix, 0, this.canvas!.width, 0, this.canvas!.height, 1000, -1000);
    this.gl!.uniformMatrix4fv(this.projectionMatrixUniformLocation, false, this.projectuonMatrix);
    this.gl?.clear(this.gl.COLOR_BUFFER_BIT);
    this.grid?.render(this.gl!, this.gl!.LINES);
  }


  ngOnInit(): void {
    this.canvas = document.querySelector('#c');
    if (this.canvas === null) {
      throw new Error('Failed to find WebGL canvas');
    }
    
    this.gl = this.canvas.getContext('webgl2');
    if (this.gl === null) {
      throw new Error('Failed to initialize WebGL rendering context');
    }
    
    this.gl.clearColor(0, 0, 0.2, 1.0);
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
    
    this.modelViewMatrixUniformLocation = this.gl.getUniformLocation(this.program, 'mvMat');
    this.projectionMatrixUniformLocation = this.gl.getUniformLocation(this.program, 'projectionMat');

    

    this.rotateCamera(-30, 45);

    this.generateGrid();
    

    this.render();
  }

}
