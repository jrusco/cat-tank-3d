import * as THREE from 'three';
import { ParticleSystem } from '../../effects/ParticleSystem';

export class TankModel {
    mesh: THREE.Group;
    velocity: THREE.Vector3;
    rotationSpeed: number;
    engineParticles: ParticleSystem;
    boundingBox: THREE.Box3;
    collisionMesh: THREE.Mesh;
    mainBody!: THREE.Mesh;
    turret!: THREE.Group;
    cannonBarrel!: THREE.Mesh;
    
    // Movement flags
    isMoving: boolean = false;
    
    // Physics constants
    maxSpeed = 0.2;
    acceleration = 0.01;
    deceleration = 0.02;
    gravity = 0.01;
    
    constructor() {
        this.mesh = new THREE.Group();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotationSpeed = 0;
        this.boundingBox = new THREE.Box3();
        this.createTank();
        
        // Create particle system for dust effects
        this.engineParticles = new ParticleSystem(500);
        this.mesh.add(this.engineParticles.particles);
        
        // Create an invisible collision mesh
        const collisionGeometry = new THREE.BoxGeometry(2, 1.5, 2.5);
        const collisionMaterial = new THREE.MeshBasicMaterial({ 
            visible: false 
        });
        this.collisionMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
        this.mesh.add(this.collisionMesh);
        
        // Initialize bounding box
        this.updateBoundingBox();
    }
    
    createTank() {
        // Tank body
        const bodyGeometry = new THREE.BoxGeometry(1.8, 0.7, 2.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5d7f99,
            roughness: 0.5,
            metalness: 0.7
        });
        this.mainBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.mainBody.castShadow = true;
        this.mainBody.position.y = 0.5;
        
        // Create turret group - raise it slightly higher
        this.turret = new THREE.Group();
        this.turret.position.y = 0.85; // Increased from 0.7 to prevent collision with tank body
        // Set initial rotation to zero so turret faces forward by default
        this.turret.rotation.y = 0;
        
        // Turret base
        const turretGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 8);
        const turretMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x436b8c,
            roughness: 0.4,
            metalness: 0.8
        });
        const turretBase = new THREE.Mesh(turretGeometry, turretMaterial);
        turretBase.castShadow = true;
        this.turret.add(turretBase);
        
        // Cannon barrel
        const cannonGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 8);
        const cannonMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2d4c66,
            roughness: 0.2,
            metalness: 0.9
        });
        this.cannonBarrel = new THREE.Mesh(cannonGeometry, cannonMaterial);
        this.cannonBarrel.castShadow = true;
        this.cannonBarrel.position.z = 0.8;
        // Fix the barrel rotation to point forward instead of upward
        this.cannonBarrel.rotation.x = Math.PI / 2;
        this.turret.add(this.cannonBarrel);
        
        // Tank tracks
        const createTrack = (xOffset: number) => {
            const trackGroup = new THREE.Group();
            
            const trackGeometry = new THREE.BoxGeometry(0.4, 0.3, 2.5);
            const trackMaterial = new THREE.MeshStandardMaterial({
                color: 0x222222,
                roughness: 0.8,
                metalness: 0.2
            });
            
            const track = new THREE.Mesh(trackGeometry, trackMaterial);
            track.castShadow = true;
            track.position.set(xOffset, 0, 0);
            track.position.y = 0.15;
            
            // Add track wheels
            const addWheel = (zPos: number) => {
                const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
                const wheel = new THREE.Mesh(wheelGeometry, trackMaterial);
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(xOffset, 0.2, zPos);
                wheel.castShadow = true;
                return wheel;
            };
            
            trackGroup.add(track);
            trackGroup.add(addWheel(0.8));
            trackGroup.add(addWheel(-0.8));
            
            return trackGroup;
        };
        
        // Cat ears
        const createEar = (xPos: number) => {
            const earGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
            const earMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x5d7f99,
                roughness: 0.7,
                metalness: 0.3
            });
            const ear = new THREE.Mesh(earGeometry, earMaterial);
            ear.castShadow = true;
            ear.position.set(xPos, 0.7, -0.5);
            return ear;
        };
        
        // Cat face features
        const createCatFace = () => {
            const faceGroup = new THREE.Group();
            
            // Eyes
            const createEye = (xPos: number) => {
                const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                const eyeMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffff00,
                    emissive: 0x444400,
                    roughness: 0.2,
                    metalness: 0.2
                });
                
                const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
                eye.position.x = xPos;
                return eye;
            };
            
            // Nose
            const noseGeometry = new THREE.ConeGeometry(0.08, 0.15, 4);
            const noseMaterial = new THREE.MeshStandardMaterial({
                color: 0xff9999,
                roughness: 1.0,
                metalness: 0.0
            });
            
            const nose = new THREE.Mesh(noseGeometry, noseMaterial);
            nose.rotation.x = -Math.PI / 2;
            
            faceGroup.add(createEye(0.3));
            faceGroup.add(createEye(-0.3));
            faceGroup.add(nose);
            
            return faceGroup;
        };
        
        const face = createCatFace();
        face.position.z = 1.26;
        face.position.y = 0.1;
        
        // Add all components to the tank group
        this.mesh.add(this.mainBody);
        this.mesh.add(this.turret);
        this.mesh.add(createTrack(0.8));
        this.mesh.add(createTrack(-0.8));
        this.mesh.add(createEar(0.4));
        this.mesh.add(createEar(-0.4));
        this.mainBody.add(face);
        
        // Position the tank on the ground
        this.mesh.position.y = 0.3;
    }
    
    updateBoundingBox() {
        this.boundingBox.setFromObject(this.mesh);
    }
    
    checkCollision(other: THREE.Box3): boolean {
        return this.boundingBox.intersectsBox(other);
    }
    
    update(controls: any, deltaTime: number = 1/60) {
        // Reset moving flag
        this.isMoving = false;
        
        // Handle tank forward/backward movement
        if (controls.moveVector.z < 0) { // Forward
            this.velocity.z = -this.maxSpeed * Math.abs(controls.moveVector.z);
            this.isMoving = true;
        } else if (controls.moveVector.z > 0) { // Backward
            this.velocity.z = this.maxSpeed * Math.abs(controls.moveVector.z) * 0.7; // Slower in reverse
            this.isMoving = true;
        } else { // Decelerate when no forward/backward input
            this.velocity.z *= 0.9;
        }
        
        // Handle tank rotation
        if (controls.moveVector.x !== 0) {
            // Rotate the tank based on left/right controls
            this.mesh.rotation.y -= controls.moveVector.x * 0.03;
            this.isMoving = true;
        }
        
        // Move tank in its facing direction
        const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.rotation.y);
        const movement = direction.multiplyScalar(this.velocity.z);
        
        // Apply movement
        this.mesh.position.add(movement);
        
        // Handle turret rotation based on mouse/look controls
        if (controls.mouseDragOn) {
            // Make turret rotation relative to the tank body
            // This ensures it starts pointing forward when controls.rotationVector.y is 0
            const turretAngle = controls.rotationVector.y * 0.5;
            this.turret.rotation.y = turretAngle;
            
            // Adjust cannon elevation based on look
            // Limit the elevation between -0.2 and 0.5 radians
            const minElevation = Math.PI/2 - 0.2; // Slightly down
            const maxElevation = Math.PI/2 + 0.5; // Up to 30 degrees up
            const targetElevation = Math.PI/2 - controls.rotationVector.x * 0.3;
            this.cannonBarrel.rotation.x = Math.max(minElevation, Math.min(maxElevation, targetElevation));
        }
        
        // Ensure the tank stays on the ground
        this.mesh.position.y = 0.3; // Fixed height above ground
        
        // Generate dust particles when moving
        if (this.isMoving) {
            // Left track dust
            const leftTrackPos = new THREE.Vector3(-0.8, 0.1, -0.8);
            leftTrackPos.applyEuler(this.mesh.rotation);
            leftTrackPos.add(this.mesh.position);
            
            // Right track dust
            const rightTrackPos = new THREE.Vector3(0.8, 0.1, -0.8);
            rightTrackPos.applyEuler(this.mesh.rotation);
            rightTrackPos.add(this.mesh.position);
            
            // Dust direction (slightly upward and backward)
            const dustDirection = new THREE.Vector3(0, 0.1, Math.sign(this.velocity.z) * 0.1);
            
            // Emit particles
            this.engineParticles.emitParticles(leftTrackPos, dustDirection, 1);
            this.engineParticles.emitParticles(rightTrackPos, dustDirection, 1);
        }
        
        // Update particle system
        this.engineParticles.update();
        
        // Update bounding box
        this.updateBoundingBox();
    }
}
