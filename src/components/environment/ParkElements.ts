import * as THREE from 'three';

export class ParkElements {
    elementsGroup: THREE.Group;
    
    constructor() {
        this.elementsGroup = new THREE.Group();
        this.createTrees();
        this.createBenches();
    }
    
    createTrees() {
        // Create 15 trees scattered around the park
        for (let i = 0; i < 15; i++) {
            const tree = this.createTree();
            
            // Random position within park boundaries
            tree.position.set(
                (Math.random() - 0.5) * 40, 
                0,
                (Math.random() - 0.5) * 40
            );
            
            // Avoid placing trees at the center (where the tank will be)
            if (Math.abs(tree.position.x) < 5 && Math.abs(tree.position.z) < 5) {
                tree.position.x += (tree.position.x > 0) ? 5 : -5;
                tree.position.z += (tree.position.z > 0) ? 5 : -5;
            }
            
            this.elementsGroup.add(tree);
        }
    }
    
    createTree() {
        const treeGroup = new THREE.Group();
        
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513, 
            roughness: 1.0,
            metalness: 0 
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.castShadow = true;
        trunk.position.y = 1;
        
        // Tree foliage (using cone for simplicity)
        const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E8B57, 
            roughness: 0.8,
            metalness: 0.1
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.castShadow = true;
        foliage.position.y = 3.5;
        
        treeGroup.add(trunk);
        treeGroup.add(foliage);
        
        return treeGroup;
    }
    
    createBenches() {
        // Add 5 benches
        for (let i = 0; i < 5; i++) {
            const bench = this.createBench();
            
            // Place benches in strategic locations
            bench.position.set(
                (Math.random() - 0.5) * 30, 
                0,
                (Math.random() - 0.5) * 30
            );
            
            // Random rotation
            bench.rotation.y = Math.random() * Math.PI * 2;
            
            this.elementsGroup.add(bench);
        }
    }
    
    createBench() {
        const benchGroup = new THREE.Group();
        
        // Bench seat
        const seatGeometry = new THREE.BoxGeometry(2, 0.1, 0.8);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.1
        });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.y = 0.5;
        seat.castShadow = true;
        
        // Bench legs
        const createLeg = (x: number, z: number) => {
            const legGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
            const legMaterial = new THREE.MeshStandardMaterial({
                color: 0x696969,
                roughness: 0.8,
                metalness: 0.5
            });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(x, 0.25, z);
            leg.castShadow = true;
            return leg;
        };
        
        // Add four legs
        benchGroup.add(createLeg(0.8, 0.3));
        benchGroup.add(createLeg(-0.8, 0.3));
        benchGroup.add(createLeg(0.8, -0.3));
        benchGroup.add(createLeg(-0.8, -0.3));
        benchGroup.add(seat);
        
        return benchGroup;
    }
}
