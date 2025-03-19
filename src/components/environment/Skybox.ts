import * as THREE from 'three';

export class Skybox {
    mesh: THREE.Mesh;
    
    constructor() {
        // For a simple implementation, we'll use a gradient sky shader
        // In a more complex implementation, you would use image textures
        
        const vertexShader = `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `;
        
        // Create shader material with sky gradient
        const uniforms = {
            topColor: { value: new THREE.Color(0x0077ff) },  // Blue
            bottomColor: { value: new THREE.Color(0xffffff) },  // White clouds
            offset: { value: 33 },
            exponent: { value: 0.6 }
        };
        
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        });
        
        const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
        this.mesh = new THREE.Mesh(skyGeometry, skyMaterial);
    }
}
