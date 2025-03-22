import * as THREE from 'three';

export class CameraFollow {
    camera: THREE.Camera;
    target: THREE.Object3D;
    offset: THREE.Vector3;
    lookOffset: THREE.Vector3;
    damping: number;
    heightAboveGround: number;
    
    constructor(camera: THREE.Camera, target: THREE.Object3D) {
        this.camera = camera;
        this.target = target;
        this.offset = new THREE.Vector3(0, 5, 10); // Behind and above
        this.lookOffset = new THREE.Vector3(0, 0, -5); // Look ahead
        this.damping = 0.1; // Smooth camera movement
        this.heightAboveGround = 3; // Height above ground
    }
    
    update() {
        // Calculate target position
        const targetPosition = new THREE.Vector3();
        this.target.getWorldPosition(targetPosition);
        
        // Calculate camera position based on target's orientation
        const offsetRotated = this.offset.clone();
        offsetRotated.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.target.rotation.y);
        
        const desiredPosition = targetPosition.clone().add(offsetRotated);
        
        // Ensure camera is always at minimum height
        desiredPosition.y = Math.max(this.heightAboveGround, desiredPosition.y);
        
        // Smoothly move camera towards desired position
        this.camera.position.lerp(desiredPosition, this.damping);
        
        // Calculate look target (ahead of the tank)
        const lookTargetOffset = this.lookOffset.clone();
        lookTargetOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.target.rotation.y);
        const lookTarget = targetPosition.clone().add(lookTargetOffset);
        
        // Camera looks at target
        this.camera.lookAt(lookTarget);
    }
}
