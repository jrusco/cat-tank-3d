import * as THREE from 'three';

export class TankModel {
    mesh: THREE.Group;
    
    constructor() {
        this.mesh = new THREE.Group();
        this.createTank();
    }
    
    createTank() {
        // Tank body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5d7f99,
            roughness: 0.5,
            metalness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        
        // Tank turret
        const turretGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 8);
        const turretMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x436b8c,
            roughness: 0.4,
            metalness: 0.8
        });
        const turret = new THREE.Mesh(turretGeometry, turretMaterial);
        turret.position.y = 0.5;
        turret.rotation.x = Math.PI / 2;
        
        // Tank cannon
        const cannonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
        const cannonMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2d4c66,
            roughness: 0.2,
            metalness: 0.9
        });
        const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
        cannon.position.z = 0.7;
        cannon.rotation.x = Math.PI / 2;
        turret.add(cannon);
        
        // Tank tracks
        const createTrack = (xPos: number) => {
            const trackGeometry = new THREE.BoxGeometry(0.2, 0.3, 2);
            const trackMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x222222,
                roughness: 0.8,
                metalness: 0.2
            });
            const track = new THREE.Mesh(trackGeometry, trackMaterial);
            track.position.x = xPos;
            track.position.y = -0.4;
            return track;
        };
        
        // Add cat ears (for fun)
        const createEar = (xPos: number) => {
            const earGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
            const earMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x5d7f99,
                roughness: 0.7,
                metalness: 0.3
            });
            const ear = new THREE.Mesh(earGeometry, earMaterial);
            ear.position.set(xPos, 0.8, -0.4);
            return ear;
        };
        
        // Add all components to the tank group
        this.mesh.add(body);
        this.mesh.add(turret);
        this.mesh.add(createTrack(0.7));
        this.mesh.add(createTrack(-0.7));
        this.mesh.add(createEar(0.4));
        this.mesh.add(createEar(-0.4));
        
        // Position the tank
        this.mesh.position.y = 0.5;
    }
    
    update() {
        // Will add animation or movement logic here later
    }
}
