import { Container } from 'pixi.js'
import { BloodGroupParticleOptions } from '../../engine/display/particle/BloodParticle'
import { DustParticle, DustParticleOptions } from '../../engine/display/particle/DustParticle'
import { GravityParticle, GravityParticleOptions } from '../../engine/display/particle/GravityParticle'
import { IParticle, Particle } from '../../engine/display/particle/Particle'
import { TextParticle } from '../../engine/display/particle/TextParticle'
import { TextParticleOptions } from '../../engine/display/particle/TextParticle'
import { IUpdatable } from '../../interface/IUpdatable'
import { IParticleCollisionManager, ParticleCollisionManager } from './ParticleCollisionManager'

export interface IParticleManager extends IUpdatable {

}

export interface ParticleManagerOptions {

}

export class ParticleManager implements IParticleManager {
    private static Instance: ParticleManager
    collisionManager: IParticleCollisionManager
    container: Container
    overlayContainer: Container
    particles: Set<IParticle>

    static getInstance() {
        if (ParticleManager.Instance === undefined) {
            ParticleManager.Instance = new ParticleManager()
        }

        return ParticleManager.Instance
    }

    private constructor() {
        this.collisionManager = new ParticleCollisionManager()
        this.container = new Container()
        this.overlayContainer = new Container()
        this.particles = new Set()
    }

    update() {
        for (var p of this.particles.values()) {
            p.update()

            if (p instanceof GravityParticle) {
                this.collisionManager.checkParticleCollision(p as GravityParticle)
            }
        }
    }

    addTextParticle(options: TextParticleOptions) {
        const textParticle = new TextParticle(options)
        this.overlayContainer.addChild(textParticle)

        this.particles.add(textParticle)
    }

    addDustParticle(options: DustParticleOptions) {
        const dustParticle = new DustParticle(options)
        this.container.addChild(dustParticle)

        this.particles.add(dustParticle)
    }

    addBloodParticles(options: GravityParticleOptions) {
        options.color = 0xc93030
        options.totalParticles = 2
        this.addGravityParticles(options)
    }

    addGravityParticles(options: GravityParticleOptions) {
        const totalParticles = options.totalParticles ?? 1

        for (var i = 0; i < totalParticles; i++) {
            const particle = new GravityParticle(options)

            this.container.addChild(particle)
            this.particles.add(particle)
        }
    }

    // addBloodParticleGroup(options: BloodGroupParticleOptions) {
    //     for (var i = 0; i < options.totalParticles; i++) {

    //     }
    // }

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
