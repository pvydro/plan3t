import { ParticleRenderer } from 'pixi.js'
import { IDemolishable } from '../../../interface/IDemolishable'
import { IUpdatable } from '../../../interface/IUpdatable'
import { ParticleManager } from '../../../manager/ParticleManager'
import { Vector2 } from '../../math/Vector2'
import { AnimatedSprite, AnimationOptions } from '../AnimatedSprite'
import { Container } from '../Container'
import { Sprite } from '../Sprite'

export interface IParticle extends IUpdatable, IDemolishable {

}

export interface ParticleOptions extends AnimationOptions, ParticlePositioningOptions {
    sprite?: Sprite | AnimatedSprite
}

export interface ParticlePositioningOptions {
    position?: Vector2
    rotation?: number
}

export class Particle extends Container implements IParticle {
    sprite: Sprite | AnimatedSprite

    constructor(options: ParticleOptions) {
        super()
        this.sprite = options.sprite
        
        if (this.sprite instanceof AnimatedSprite)  {
            this.sprite.animationSpeed = options.animationSpeed ?? this.sprite.animationSpeed
            this.sprite.loop = options.loop ?? false
        }
        this.rotation = options.rotation ?? this.rotation
        this.position = options.position ?? this.position
        
        this.addChild(this.sprite)
    }
    
    update() {

    }
    
    demolish(): void {
        ParticleManager.getInstance().removeParticle(this)
        delete this.sprite
    }
}
