export const vertexShader = `#version 300 es
layout(location = 0) in vec3 position;
layout(location = 1) in vec4 color;
out vec4 vert_color;
uniform mat4 modelMat;
uniform mat4 projectionMat;

void main() {
    vec4 position4 = vec4(position, 1);
    gl_Position = projectionMat * modelMat * position4;
    vert_color = color;
}
`;