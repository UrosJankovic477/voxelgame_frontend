import { vec4 } from "gl-matrix";
import { Vertex } from "./vertex.model";
import { vec3 } from "gl-matrix";
import rgba from "color-rgba";

export class Mesh {
    constructor(gl: WebGL2RenderingContext, vertices: Vertex[] = []) {
        this.vertexArrayObject = gl.createVertexArray();
        this.buffer = gl.createBuffer();
        this.vertices = vertices;
    }

    vertexArrayObject: WebGLVertexArrayObject | null;
    buffer: WebGLBuffer | null;
    vertices: Vertex[];


    public getVertexArrayBuffer(): ArrayBuffer {
        const buffer = new ArrayBuffer(this.vertices.length * 20);
        const asUint8 = new Uint8Array(buffer);
        const asFloat32 = new Float32Array(buffer);

        this.vertices.forEach((vertex, i) => {
            // map position
            asFloat32[4 * i] = vertex.position[0];
            asFloat32[4 * i + 1] = vertex.position[1];
            asFloat32[4 * i + 2] = vertex.position[2];
            //map color
            asUint8[16 * i + 12] = vertex.color[0];
            asUint8[16 * i + 13] = vertex.color[1];
            asUint8[16 * i + 14] = vertex.color[2];
            asUint8[16 * i + 15] = vertex.color[3];
        })
        
        return buffer;
    }

    public render(gl: WebGL2RenderingContext, mode: GLenum) {
        gl.bindVertexArray(this.vertexArrayObject);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.drawArrays(mode, 0, this.vertices.length);
        gl.disableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    public load(gl: WebGL2RenderingContext) {
        gl.bindVertexArray(this.vertexArrayObject);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, 16, 12);

        gl.bufferData(gl.ARRAY_BUFFER, this.getVertexArrayBuffer(), gl.STATIC_DRAW);
        
        gl.disableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    public static generateGrid(gl: WebGL2RenderingContext, width: number = 16, color: [number, number, number, number] | string = 'CadetBlue') {
        const positions: Array<vec3> = new Array<vec3>((width + 1) * 4);
        const colors: Array<vec4> = new Array<vec4>((width + 1) * 4);
        const rgbaColor = typeof(color) === "string" ? rgba(color) : color;
        if (rgbaColor.length != 4) {
          throw new Error('Invalid grid color.');
        }

        rgbaColor[3] = Math.round(rgbaColor[3] * 255);

        colors.fill(rgbaColor);
        const gridEnd = width / 2;

        for (let i = 0; i < width + 1; i++) {
          const position = i - gridEnd;
          positions[4 * i] = [position, 0, gridEnd]; 
          positions[4 * i + 1] = [position, 0, -gridEnd]; 
          positions[4 * i + 2] = [gridEnd, 0, position]; 
          positions[4 * i + 3] = [-gridEnd, 0, position]; 
        }

        const vertices: Array<Vertex> = new Array<Vertex>((width + 1) * 4);
        for (let i: number = 0; i < vertices.length; i++) {
            vertices[i] = {
                color: colors[i],
                position: positions[i]
            };
        }

        return new Mesh(gl, vertices);
    }
}