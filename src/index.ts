import * as THREE from 'three';
import { TankModel } from './components/tank/TankModel';
import { SceneSetup } from './components/scene/SceneSetup';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create scene using our setup class
const sceneManager = new SceneSetup();
const scene = sceneManager.scene;

// Create camera
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Add orbit controls for easier development/testing
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Create tank
const tank = new TankModel();
scene.add(tank.mesh);

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
