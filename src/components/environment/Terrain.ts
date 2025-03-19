import * as THREE from 'three';

export class Terrain {
    mesh: THREE.Mesh;

    constructor(width: number = 50, height: number = 50, segments: number = 50) {
        // Create terrain with subtle height variations
        const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
        
        // Apply height variations to create gentle hills
        const vertices = geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getZ(i);
            
            // Create gentle hills using sine waves
            const hillHeight = Math.sin(x/5) * Math.cos(z/5) * 0.5;
            vertices.setY(i, hillHeight);
        }
        
        // Update geometry after modifications
        geometry.computeVertexNormals();
        
        // Create terrain material with grass texture
        const material = new THREE.MeshStandardMaterial({
            color: 0x4CAF50,
            roughness: 0.8,
            metalness: 0.1,
            flatShading: false
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
    }
}
