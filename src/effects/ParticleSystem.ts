import * as THREE from 'three';

export class ParticleSystem {
    particles: THREE.Points;
    private geometry: THREE.BufferGeometry;
    private particleCount: number;
    private particlePositions: Float32Array;
    private particleSizes: Float32Array;
    private particleOpacities: Float32Array;
    private particleLifespans: Float32Array;
    private positionAttribute: THREE.BufferAttribute;
    private opacityAttribute: THREE.BufferAttribute;
    private sizeAttribute: THREE.BufferAttribute;
    
    constructor(count: number = 500) {
        this.particleCount = count;
        this.particlePositions = new Float32Array(count * 3);
        this.particleSizes = new Float32Array(count);
        this.particleOpacities = new Float32Array(count);
        this.particleLifespans = new Float32Array(count);
        
        // Initialize particles
        for (let i = 0; i < count; i++) {
            this.particlePositions[i * 3] = 0;
            this.particlePositions[i * 3 + 1] = 0;
            this.particlePositions[i * 3 + 2] = 0;
            
            this.particleSizes[i] = 0.1;
            this.particleOpacities[i] = 0;
            this.particleLifespans[i] = 0;
        }
        
        // Create geometry
        this.geometry = new THREE.BufferGeometry();
        
        // Add attributes
        this.positionAttribute = new THREE.BufferAttribute(this.particlePositions, 3);
        this.positionAttribute.setUsage(THREE.DynamicDrawUsage);
        this.geometry.setAttribute('position', this.positionAttribute);
        
        this.opacityAttribute = new THREE.BufferAttribute(this.particleOpacities, 1);
        this.opacityAttribute.setUsage(THREE.DynamicDrawUsage);
        this.geometry.setAttribute('opacity', this.opacityAttribute);
        
        this.sizeAttribute = new THREE.BufferAttribute(this.particleSizes, 1);
        this.geometry.setAttribute('size', this.sizeAttribute);
        
        // Create material with custom shader to handle opacity per particle
        const material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.createDustTexture() }
            },
            vertexShader: `
                attribute float opacity;
                attribute float size;
                varying float vOpacity;
                
                void main() {
                    vOpacity = opacity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying float vOpacity;
                
                void main() {
                    gl_FragColor = texture2D(pointTexture, gl_PointCoord);
                    gl_FragColor.a *= vOpacity;
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true
        });
        
        // Create the particle system
        this.particles = new THREE.Points(this.geometry, material);
    }
    
    createDustTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        
        const context = canvas.getContext('2d')!;
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,240,210,1)'); // Dust color
        gradient.addColorStop(1, 'rgba(255,240,210,0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    emitParticles(position: THREE.Vector3, direction: THREE.Vector3, count: number = 3) {
        // Find unused particles
        for (let i = 0, emitted = 0; i < this.particleCount && emitted < count; i++) {
            if (this.particleLifespans[i] <= 0) {
                // Reset particle
                this.particlePositions[i * 3] = position.x;
                this.particlePositions[i * 3 + 1] = position.y;
                this.particlePositions[i * 3 + 2] = position.z;
                
                // Random spread
                const spread = 0.1;
                const randomX = (Math.random() - 0.5) * spread;
                const randomY = (Math.random() - 0.5) * spread;
                const randomZ = (Math.random() - 0.5) * spread;
                
                // Add direction with random spread
                this.particlePositions[i * 3] += randomX;
                this.particlePositions[i * 3 + 1] += randomY + Math.random() * 0.05; // Slight upward bias
                this.particlePositions[i * 3 + 2] += randomZ;
                
                // Set size (for dust, slightly larger)
                this.particleSizes[i] = Math.random() * 0.3 + 0.2;
                this.particleOpacities[i] = 0.7 + Math.random() * 0.3;
                this.particleLifespans[i] = 30 + Math.random() * 30; // Variable lifespan
                
                emitted++;
            }
        }
        
        this.positionAttribute.needsUpdate = true;
        this.opacityAttribute.needsUpdate = true;
        this.sizeAttribute.needsUpdate = true;
    }
    
    update() {
        for (let i = 0; i < this.particleCount; i++) {
            if (this.particleLifespans[i] > 0) {
                // Reduce lifespan
                this.particleLifespans[i]--;
                
                // Fade out
                this.particleOpacities[i] = this.particleLifespans[i] / 60;
                
                // Dust rises and spreads
                this.particlePositions[i * 3] += (Math.random() - 0.5) * 0.01;
                this.particlePositions[i * 3 + 1] += 0.01; // Rise
                this.particlePositions[i * 3 + 2] += (Math.random() - 0.5) * 0.01;
            }
        }
        
        this.positionAttribute.needsUpdate = true;
        this.opacityAttribute.needsUpdate = true;
    }
}
