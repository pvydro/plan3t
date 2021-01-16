import { Container } from 'pixi.js'
import { Particle } from '../engine/display/particle/Particle'

export interface IParticleManager {

}

export interface ParticleManagerOptions {

}

export class ParticleManager {
    private static INSTANCE: ParticleManager
    container: Container
    // _particles

    public static getInstance() {
        if (ParticleManager.INSTANCE === undefined) {
            ParticleManager.INSTANCE = new ParticleManager()
        }

        return ParticleManager.INSTANCE
    }

    private constructor() {
        this.container = new Container()
    }

    addParticle(particle: Particle, container?: Container) {
        const cont = container ?? this.container
        cont.addChild(particle)
    }

    removeParticle(particle: Particle, container?: Container) {
        const cont = container ?? this.container
        cont.removeChild(particle)
    }
}
