import { Container } from 'pixi.js'
import { Particle } from '../engine/display/particle/Particle'
import { TextParticle } from '../engine/display/particle/TextParticle'
import { TextParticleOptions } from '../engine/display/particle/TextParticle'
import { Flogger } from '../service/Flogger'

export interface IParticleManager {

}

export interface ParticleManagerOptions {

}

export class ParticleManager {
    private static INSTANCE: ParticleManager
    container: Container

    public static getInstance() {
        if (ParticleManager.INSTANCE === undefined) {
            ParticleManager.INSTANCE = new ParticleManager()
        }

        return ParticleManager.INSTANCE
    }

    private constructor() {
        this.container = new Container()
    }

    addTextParticle(options: TextParticleOptions) {
        const textParticle = new TextParticle(options)
        this.container.addChild(textParticle)
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
