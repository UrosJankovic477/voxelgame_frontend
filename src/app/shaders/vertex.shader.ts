export const vertexShader = `#version 300 es
layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec4 color;
out vec4 vert_color;
uniform mat4 modelMat;
uniform mat4 projectionMat;

void main() {
    vec4 position4 = vec4(position, 1);
    gl_Position = projectionMat * modelMat * position4;
    gl_Position.z = -gl_Position.z;
    float lum = dot(normal, normalize(vec3(2, 5, 3)));
    lum = (lum + 1.0f) / 2.0f + 0.2f;
    lum = min(1.0f, lum);
    vert_color = color;
    vert_color.xyz *= lum;
}
`;