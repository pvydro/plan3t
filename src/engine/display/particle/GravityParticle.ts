import { IRect } from '../../math/Rect'
import { IParticle, Particle } from './Particle'

export interface IGravityParticle extends IParticle {
    landedOnGround(ground: IRect): void
}

export class GravityParticle extends Particle implements IGravityParticle {
    xVel: number
    yVel: number
    onGround: boolean
    currentGroundRect?: IRect

    update() {
        this.x += this.xVel
        this.y += this.yVel
    }

    landedOnGround(groundRect: IRect) {
        this.onGround = true
        this.currentGroundRect = groundRect
    }
}
