import { Container, Sprite } from 'pixi.js'
import { IUpdatable } from '../../../interface/IUpdatable'
import { GlobalScale } from '../../../utils/Constants'

export interface IParticle extends IUpdatable {

}

export interface ParticleOptions {
    sprite?: Sprite
}

export abstract class Particle extends Container implements IParticle {
    sprite: Sprite

    constructor(options?: ParticleOptions) {
        super()

        if (this.sprite !== undefined) {
            this.addChild(this.sprite)
        }

        this.scale.set(GlobalScale, GlobalScale)
    }
    
    update() {

    }
}
