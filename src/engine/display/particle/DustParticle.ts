import { Graphix } from '../Graphix'
import { IParticle, Particle, ParticleOptions } from './Particle'

export interface IDustParticle extends IParticle {

}

export interface DustParticleOptions extends ParticleOptions {
    
}

export class DustParticle extends Particle implements IDustParticle {
    xSpreadRange: number
    ySpreadRange: number
    xVel: number
    yVel: number
    onGround: boolean

    constructor(options: DustParticleOptions) {
        const genericColor = 0xb8b8b8
        const dustSize = 1
        const dustSquare = new Graphix()

        dustSquare.beginFill(genericColor)
        dustSquare.drawRect(0, 0, dustSize, dustSize)
        dustSquare.endFill()

        options.sprite = dustSquare

        super(options)

        this.xSpreadRange = 2
        this.ySpreadRange = 4
        this.onGround = false

        this.xVel = Math.random() * this.xSpreadRange
        this.yVel = -Math.random() * this.ySpreadRange
    }

    update() {
        this.x += this.xVel
        this.y += this.yVel

        this.xVel += (0 - this.xVel) / 10
        if (this.onGround === false) {
            this.yVel += 0.1
        }
    }
}
