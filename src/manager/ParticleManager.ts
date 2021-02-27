import { Container } from 'pixi.js'
import { DustParticle, DustParticleOptions } from '../engine/display/particle/DustParticle'
import { IParticle, Particle } from '../engine/display/particle/Particle'
import { TextParticle } from '../engine/display/particle/TextParticle'
import { TextParticleOptions } from '../engine/display/particle/TextParticle'
import { IUpdatable } from '../interface/IUpdatable'

export interface IParticleManager extends IUpdatable {

}

export interface ParticleManagerOptions {

}

export class ParticleManager implements IParticleManager {
    private static INSTANCE: ParticleManager
    container: Container
    overlayContainer: Container
    particles: Set<IParticle>

    public static getInstance() {
        if (ParticleManager.INSTANCE === undefined) {
            ParticleManager.INSTANCE = new ParticleManager()
        }

        return ParticleManager.INSTANCE
    }

    private constructor() {
        this.container = new Container()
        this.overlayContainer = new Container()
        this.particles = new Set()
    }

    update() {
        for (var p of this.particles.values()) {
            p.update()
        }
    }

    addTextParticle(options: TextParticleOptions) {
        const textParticle = new TextParticle(options)
        this.overlayContainer.addChild(textParticle)

        this.particles.add(textParticle)
    }

    addDustParticles(options: DustParticleOptions) {
        const dustParticle = new DustParticle(options)
        this.container.addChild(dustParticle)

        this.particles.add(dustParticle)
    }

    addParticle(particle: Particle, container?: Container) {
        const cont = container ?? this.container
        cont.addChild(particle)

        this.particles.add(particle)
    }

    removeParticle(particle: Particle, container?: Container) {
        const cont = container ?? this.container
        cont.removeChild(particle)

        this.particles.delete(particle)
    }
}
