import * as THREE from 'three';
import { Terrain } from '../environment/Terrain';
import { ParkElements } from '../environment/ParkElements';
import { Skybox } from '../environment/Skybox';

export class SceneSetup {
    scene: THREE.Scene;
    
    constructor() {
        this.scene = new THREE.Scene();
        this.setupLighting();
        this.setupTerrain();
        this.setupParkElements();
        this.setupSkybox();
    }
    
    setupLighting() {
        // Enhanced lighting setup
        
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 100, 30);
        directionalLight.castShadow = true;
        
        // Improve shadow quality
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        
        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0x9090ff, 0.4);
        fillLight.position.set(-50, 30, -50);
        
        this.scene.add(directionalLight);
        this.scene.add(fillLight);
        
        // Helper to visualize light direction (for development)
        // const helper = new THREE.DirectionalLightHelper(directionalLight, 10);
        // this.scene.add(helper);
    }
    
    setupTerrain() {
        // Use our new terrain class instead of a simple plane
        const terrain = new Terrain(100, 100, 64);
        this.scene.add(terrain.mesh);
    }
    
    setupParkElements() {
        // Add trees, benches and other park elements
        const parkElements = new ParkElements();
        this.scene.add(parkElements.elementsGroup);
    }
    
    setupSkybox() {
        // Add our gradient skybox
        const skybox = new Skybox();
        this.scene.add(skybox.mesh);
    }
}
