import { Container } from 'pixi.js'
import { BloodGroupParticleOptions } from '../../engine/display/particle/BloodParticle'
import { DustParticle, DustParticleOptions } from '../../engine/display/particle/DustParticle'
import { GravityParticle, GravityParticleOptions } from '../../engine/display/particle/GravityParticle'
import { KillSkullParticle } from '../../engine/display/particle/KillSkullParticle'
import { IParticle, Particle } from '../../engine/display/particle/Particle'
import { TextParticle } from '../../engine/display/particle/TextParticle'
import { TextParticleOptions } from '../../engine/display/particle/TextParticle'
import { IUpdatable } from '../../interface/IUpdatable'
import { IParticleCollisionManager, ParticleCollisionManager } from './ParticleCollisionManager'

export interface IParticleManager extends IUpdatable {
    container: Container
    overlayContainer: Container
    addTextParticle(options: TextParticleOptions): void
    addBloodParticles(options: GravityParticleOptions): void
    addDustParticle(options: DustParticleOptions): void
    addDeathSkullParticle(options: GravityParticleOptions): void
    addGravityParticles(options: GravityParticleOptions): void
    removeParticle(particle: Particle, container?: Container): void
    addParticle(particle: Particle, container?: Container): void
}

export interface ParticleManagerOptions {

}

export class ParticleManager implements IParticleManager {
    collisionManager: IParticleCollisionManager
    container: Container = new Container()
    overlayContainer: Container = new Container()
    particles: Set<IParticle> = new Set()

    constructor() {
        this.collisionManager = new ParticleCollisionManager()
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
        options.color = 0x962424
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

    addDeathSkullParticle(options: GravityParticleOptions) {
        const killSkullParticle = new KillSkullParticle(options)

        this.addParticle(killSkullParticle)
    }

    addParticle(particle: Particle, container?: Container) {
        const cont = container ?? this.container
        cont.addChild(particle)

        this.particles.add(particle)
    }

    removeParticle(particle: Particle, container?: Container) {
        if (particle.hasBeenRemoved) return

        particle.hasBeenRemoved = true
        
        const cont = container ?? this.container
        cont.removeChild(particle)

        this.particles.delete(particle)
    }
}
