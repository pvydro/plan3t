import { IDemolishable } from '../../../interface/IDemolishable'
import { IUpdatable } from '../../../interface/IUpdatable'
import { ParticleManager } from '../../../manager/particlemanager/ParticleManager'
import { IVector2 } from '../../math/Vector2'
import { AnimatedSprite, AnimationOptions } from '../AnimatedSprite'
import { Container } from '../Container'
import { Graphix } from '../Graphix'
import { Sprite } from '../Sprite'
import { TextSprite } from '../TextSprite'

export interface IParticle extends IUpdatable, IDemolishable {

}

export interface ParticleOptions extends AnimationOptions, ParticlePositioningOptions {
    sprite?: Sprite | AnimatedSprite | TextSprite | Graphix
}

export interface ParticlePositioningOptions {
    position?: IVector2
    rotation?: number
}

export class Particle extends Container implements IParticle {
    sprite?: Sprite | AnimatedSprite | TextSprite | Graphix

    constructor(options: ParticleOptions) {
        super()
        this.sprite = options.sprite
        
        if (this.sprite instanceof AnimatedSprite)  {
            this.sprite.animationSpeed = options.animationSpeed ?? this.sprite.animationSpeed
            this.sprite.loop = options.loop ?? false
        }
        this.rotation = options.rotation ?? this.rotation
        if (options.position) {
            this.position.x = options.position.x ?? 0
            this.position.y = options.position.y ?? 0
        }
        
        if (this.sprite) {
            this.addChild(this.sprite)
        }
    }
    
    update() {

    }
    
    demolish(): void {
        ParticleManager.getInstance().removeParticle(this)
        if (this.sprite) {
            this.sprite.destroy()
            delete this.sprite
        }
    }
}
