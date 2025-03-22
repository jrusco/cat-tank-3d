import * as THREE from 'three';
import { TankModel } from './components/tank/TankModel';
import { SceneSetup } from './components/scene/SceneSetup';
import { AudioManager } from './utils/AudioManager';
import { TankControls } from './controls/TankControls';
import { CameraFollow } from './controls/CameraFollow';

// Scene setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create scene
const sceneManager = new SceneSetup();
const scene = sceneManager.scene;

// Create camera
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(0, 5, 10);

// Create tank
const tank = new TankModel();
scene.add(tank.mesh);

// Tank controls
const tankControls = new TankControls();

// Camera follow system
const cameraFollow = new CameraFollow(camera, tank.mesh);

// Setup audio manager
const audioManager = new AudioManager(camera);

// Load engine sound
try {
    audioManager.loadAmbientSound('engineSound', 'audio/engine.mp3', true, 0.2)
        .then(() => {
            audioManager.play('engineSound');
        })
        .catch((error) => {
            console.warn('Engine sound not loaded:', error);
        });
} catch (error) {
    console.warn('Audio manager error:', error);
}

// Clock for delta time
const clock = new THREE.Clock();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Get delta time
    const deltaTime = clock.getDelta();
    
    // Update tank
    tank.update(tankControls, deltaTime);
    
    // Update camera
    cameraFollow.update();
    
    // Render scene
    renderer.render(scene, camera);
}

// Start animation loop
animate();

// Instructions overlay
createInstructions();

function createInstructions() {
    const instructions = document.createElement('div');
    instructions.style.position = 'absolute';
    instructions.style.top = '10px';
    instructions.style.width = '100%';
    instructions.style.textAlign = 'center';
    instructions.style.color = '#ffffff';
    instructions.style.fontFamily = 'Arial, sans-serif';
    instructions.style.fontSize = '14px';
    instructions.style.fontWeight = 'bold';
    instructions.style.textShadow = '1px 1px 1px rgba(0,0,0,0.5)';
    instructions.innerHTML = 'WASD/Arrow Keys: Move tank, Mouse: Aim turret';
    document.body.appendChild(instructions);
    
    // Hide instructions after 5 seconds
    setTimeout(() => {
        instructions.style.opacity = '0';
        instructions.style.transition = 'opacity 1s ease';
    }, 5000);
}
