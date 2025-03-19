import * as THREE from 'three';
import { TankModel } from './components/tank/TankModel';
import { SceneSetup } from './components/scene/SceneSetup';
import { AudioManager } from './utils/AudioManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create scene using our enhanced setup class
const sceneManager = new SceneSetup();
const scene = sceneManager.scene;

// Create camera
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// Add orbit controls for easier development/testing
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 50;

// Create tank
const tank = new TankModel();
scene.add(tank.mesh);

// Setup audio manager
const audioManager = new AudioManager(camera);

// Load ambient sounds
// Note: You'll need to add sound files to your project
// For example: public/audio/park-ambience.mp3
try {
    audioManager.loadAmbientSound('parkAmbience', 'audio/park-ambience.mp3', true, 0.3)
        .then(() => {
            audioManager.play('parkAmbience');
        })
        .catch((error) => {
            console.warn('Sound not loaded yet, add audio files to enable sounds:', error);
        });
} catch (error) {
    console.warn('Audio manager error:', error);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    renderer.render(scene, camera);
}

animate();
