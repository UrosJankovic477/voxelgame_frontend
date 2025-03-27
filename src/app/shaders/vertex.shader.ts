export const vertexShader = `#version 300 es
layout(location = 0) in vec4 position;
layout(location = 1) in vec4 color;
out vec4 vert_color;
uniform mat4 mvMat;
uniform mat4 projectionMat;

void main() {
    gl_Position = projectionMat * mvMat * position;
    vert_color = color;
}
`;