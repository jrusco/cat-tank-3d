import * as THREE from 'three';

export class TankControls {
    // Movement state
    moveState = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0,
        pitchUp: 0,
        pitchDown: 0,
        yawLeft: 0,
        yawRight: 0,
        rollLeft: 0,
        rollRight: 0
    };
    
    // Movement vectors
    moveVector = new THREE.Vector3(0, 0, 0);
    rotationVector = new THREE.Vector3(0, 0, 0);
    
    // Speed modifiers 
    movementSpeedMultiplier = 0.5; 
    rotationSpeedMultiplier = 0.5; 
    
    // Track key states
    keys: { [key: string]: boolean } = {};
    
    // Mouse controls
    mouseDragOn = false;
    mouseStatus = {
        x: 0,
        y: 0
    };
    
    constructor() {
        this.initKeyboardControls();
        this.initMouseControls();
    }
    
    initKeyboardControls() {
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }
    
    initMouseControls() {
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }
    
    onKeyDown(event: KeyboardEvent) {
        if (event.repeat) return;
        
        this.keys[event.code] = true;
        
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveState.forward = 1;
                break;
                
            case 'ArrowDown':
            case 'KeyS':
                this.moveState.back = 1;
                break;
                
            case 'ArrowLeft':
            case 'KeyA':
                this.moveState.left = 1;
                break;
                
            case 'ArrowRight':
            case 'KeyD':
                this.moveState.right = 1;
                break;
                
            case 'KeyR':
            case 'Space':
                this.moveState.up = 1;
                break;
                
            case 'KeyF':
            case 'ShiftLeft':
                this.moveState.down = 1;
                break;
                
            case 'KeyQ':
                this.moveState.rollLeft = 1;
                break;
                
            case 'KeyE':
                this.moveState.rollRight = 1;
                break;
        }
        
        this.updateMovementVector();
        this.updateRotationVector();
    }
    
    onKeyUp(event: KeyboardEvent) {
        this.keys[event.code] = false;
        
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveState.forward = 0;
                break;
                
            case 'ArrowDown':
            case 'KeyS':
                this.moveState.back = 0;
                break;
                
            case 'ArrowLeft':
            case 'KeyA':
                this.moveState.left = 0;
                break;
                
            case 'ArrowRight':
            case 'KeyD':
                this.moveState.right = 0;
                break;
                
            case 'KeyR':
            case 'Space':
                this.moveState.up = 0;
                break;
                
            case 'KeyF':
            case 'ShiftLeft':
                this.moveState.down = 0;
                break;
                
            case 'KeyQ':
                this.moveState.rollLeft = 0;
                break;
                
            case 'KeyE':
                this.moveState.rollRight = 0;
                break;
        }
        
        this.updateMovementVector();
        this.updateRotationVector();
    }
    
    onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.mouseDragOn = true;
        }
    }
    
    onMouseUp(event: MouseEvent) {
        if (event.button === 0) {
            this.mouseDragOn = false;
            
            // Reset pitch and yaw when mouse is released
            this.moveState.pitchUp = 0;
            this.moveState.pitchDown = 0;
            this.moveState.yawLeft = 0;
            this.moveState.yawRight = 0;
            
            this.updateRotationVector();
        }
    }
    
    onMouseMove(event: MouseEvent) {
        if (!this.mouseDragOn) return;
        
        const container = document.body;
        const halfWidth = container.clientWidth / 2;
        const halfHeight = container.clientHeight / 2;
        
        this.mouseStatus.x = (event.pageX - halfWidth) / halfWidth;
        this.mouseStatus.y = (event.pageY - halfHeight) / halfHeight;
        
        // Mouse controls pitch and yaw
        this.moveState.yawLeft = this.mouseStatus.x < 0 ? -this.mouseStatus.x : 0;
        this.moveState.yawRight = this.mouseStatus.x > 0 ? this.mouseStatus.x : 0;
        this.moveState.pitchDown = this.mouseStatus.y > 0 ? this.mouseStatus.y : 0;
        this.moveState.pitchUp = this.mouseStatus.y < 0 ? -this.mouseStatus.y : 0;
        
        this.updateRotationVector();
    }
    
    updateMovementVector() {
        this.moveVector.x = (-this.moveState.left + this.moveState.right) * this.movementSpeedMultiplier;
        this.moveVector.y = (-this.moveState.down + this.moveState.up) * this.movementSpeedMultiplier;
        this.moveVector.z = (-this.moveState.forward + this.moveState.back) * this.movementSpeedMultiplier;
    }
    
    updateRotationVector() {
        this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp) * this.rotationSpeedMultiplier;
        this.rotationVector.y = (-this.moveState.yawRight + this.moveState.yawLeft) * this.rotationSpeedMultiplier;
        this.rotationVector.z = (-this.moveState.rollRight + this.moveState.rollLeft) * this.rotationSpeedMultiplier;
    }
    
    dispose() {
        document.removeEventListener('keydown', this.onKeyDown.bind(this), false);
        document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
        document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.removeEventListener('mousedown', this.onMouseDown.bind(this), false);
        document.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
    }
}
