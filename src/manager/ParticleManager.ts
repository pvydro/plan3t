import { Container } from 'pixi.js'
import { IParticle, Particle } from '../engine/display/particle/Particle'
import { TextParticle } from '../engine/display/particle/TextParticle'
import { TextParticleOptions } from '../engine/display/particle/TextParticle'
import { IUpdatable } from '../interface/IUpdatable'

export interface IParticleManager extends IUpdatable {

}

export interface ParticleManagerOptions {

}

export class ParticleManager {
    private static INSTANCE: ParticleManager
    container: Container
    overlayContainer: Container
    particles: IParticle[]

    public static getInstance() {
        if (ParticleManager.INSTANCE === undefined) {
            ParticleManager.INSTANCE = new ParticleManager()
        }

        return ParticleManager.INSTANCE
    }

    private constructor() {
        this.container = new Container()
        this.overlayContainer = new Container()
    }

    addTextParticle(options: TextParticleOptions) {
        const textParticle = new TextParticle(options)
        this.overlayContainer.addChild(textParticle)

        // this.particles.push(textParticle)
    }

    addParticle(particle: Particle, container?: Container) {
        const cont = container ?? this.container
        cont.addChild(particle)

        // this.particles.push(particle) // TODO Make this a Set
    }

    removeParticle(particle: Particle, container?: Container) {
        const cont = container ?? this.container
        cont.removeChild(particle)
    }
}
