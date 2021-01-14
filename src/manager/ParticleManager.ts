import { Particle } from '../engine/display/particle/Particle'

export interface IParticleManager {

}

export interface ParticleManagerOptions {

}

export class ParticleManager {
    private static INSTANCE: ParticleManager
    container: PIXI.ParticleContainer
    _particles

    public static getInstance() {
        if (ParticleManager.INSTANCE === undefined) {
            ParticleManager.INSTANCE = new ParticleManager()
        }

        return ParticleManager.INSTANCE
    }

    private constructor() {
        this.container = new PIXI.ParticleContainer()
    }

    addParticle(particle: Particle) {
        this.container.addChild(particle)
    }

    removeParticle(particle: Particle) {
        this.container.removeChild(particle)
    }
}
