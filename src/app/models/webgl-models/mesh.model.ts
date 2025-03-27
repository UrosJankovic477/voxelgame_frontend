import { vec4 } from "gl-matrix";

export class Mesh {
    constructor(gl: WebGL2RenderingContext, vertices: vec4[] = [], colors: vec4[] = []) {
        this.vertexArrayObject = gl.createVertexArray();
        this.buffer = gl.createBuffer();
        this.vertices = vertices
        this.colors = colors;

    }

    vertexArrayObject: WebGLVertexArrayObject | null;
    buffer: WebGLBuffer | null;
    vertices: vec4[];
    colors: vec4[];
    loaded: boolean = false;

    public getVertexDataInterleaved(): ArrayBuffer {
        const buffer = new ArrayBuffer(this.vertices.length * 20);
        const asUint8 = new Uint8Array(buffer);
        const asFloat32 = new Float32Array(buffer);

        this.vertices.forEach((vertex, i) => {
            asFloat32[5 * i] = vertex[0];
            asFloat32[5 * i + 1] = vertex[1];
            asFloat32[5 * i + 2] = vertex[2];
            asFloat32[5 * i + 3] = vertex[3];
        });
        this.colors.forEach((color, i) => {
            asUint8[20 * i + 16] = color[0];
            asUint8[20 * i + 17] = color[1];
            asUint8[20 * i + 18] = color[2];
            asUint8[20 * i + 19] = color[3];
        });
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
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, 20, 16);

        gl.bufferData(gl.ARRAY_BUFFER, this.getVertexDataInterleaved(), gl.STATIC_DRAW);
        
        gl.disableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
}