import * as THREE from 'three';

export class AudioManager {
    private readonly listener: THREE.AudioListener;
    private readonly sounds: Map<string, THREE.Audio>;
    
    constructor(camera: THREE.Camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        this.sounds = new Map();
    }
    
    loadAmbientSound(name: string, url: string, loop: boolean = true, volume: number = 0.5): Promise<void> {
        return new Promise((resolve, reject) => {
            const sound = new THREE.Audio(this.listener);
            const audioLoader = new THREE.AudioLoader();
            
            audioLoader.load(
                url,
                (buffer) => {
                    sound.setBuffer(buffer);
                    sound.setLoop(loop);
                    sound.setVolume(volume);
                    this.sounds.set(name, sound);
                    resolve();
                },
                undefined,
                (error) => {
                    console.error('Error loading audio:', error);
                    reject(error);
                }
            );
        });
    }
    
    play(name: string): void {
        const sound = this.sounds.get(name);
        if (sound && !sound.isPlaying) {
            sound.play();
        }
    }
    
    stop(name: string): void {
        const sound = this.sounds.get(name);
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    }
}
