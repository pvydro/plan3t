import { IContainer, Container } from '../engine/display/Container'

export interface IParticle extends IContainer, IUpdatable {

}

export interface ParticleOptions {
    sprite?: Sprite
}

export class Particle extends Container implements IParticle {
    constructor(options?: ParticleOptions) {
        super()
    }

    update() {

    }
}
