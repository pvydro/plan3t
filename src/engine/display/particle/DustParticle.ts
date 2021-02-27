import { GameLoop } from '../../../gameloop/GameLoop'
import { ICanDie } from '../../../interface/ICanDie'
import { IRect } from '../../math/Rect'
import { Graphix } from '../Graphix'
import { GravityParticle, IGravityParticle } from './GravityParticle'
import { ParticleOptions } from './Particle'

export interface IDustParticle extends IGravityParticle, ICanDie {

}

export interface DustParticleOptions extends ParticleOptions {
    color?: number
}

export class DustParticle extends GravityParticle implements IDustParticle {
    dead: boolean
    xSpreadRange: number
    ySpreadRange: number
    calculatedStartYVel: number
    hasBounced: boolean
    minimumLifespan: number
    lifespanRandomizationRange: number 
    lifespanCountdown: number

    constructor(options: DustParticleOptions) {
        const genericColor = options.color ?? 0xb8b8b8
        const negative = (Math.random() > 0.5) === true
        const dustSize = 2
        const dustSquare = new Graphix()

        dustSquare.beginFill(genericColor)
        dustSquare.drawRect(0, 0, dustSize, dustSize)
        dustSquare.endFill()

        options.sprite = dustSquare

        super(options)

        this.xSpreadRange = 1
        this.ySpreadRange = 3
        this.onGround = false
        this.hasBounced = false
        this.minimumLifespan = 60
        this.lifespanRandomizationRange = 20
        this.lifespanCountdown = this.minimumLifespan + Math.random() * this.lifespanRandomizationRange

        this.xVel = Math.random() * this.xSpreadRange
        this.calculatedStartYVel = -Math.random() * this.ySpreadRange
        this.yVel = this.calculatedStartYVel

        if (negative) {
            this.xVel *= -1
        }
    }

    update() {
        super.update()

        // Physics
        this.xVel += (0 - this.xVel) / 10
        if (this.onGround === false) {
            this.yVel += 0.2
        }

        // Lifespan
        if (this.dead) {
            this.alpha -= 0.15
            if (this.alpha <= 0) {
                this.demolish()
            }
            return
        }

        this.lifespanCountdown -= GameLoop.Delta

        if (this.lifespanCountdown <= 0) {
            this.die()
        }
    }

    landedOnGround(groundRect: IRect) {
        if (this.hasBounced) {
            this.onGround = true
            this.yVel = 0
            this.y = groundRect.y - this.height
            this.currentGroundRect = groundRect
        } else {
            this.bounce()
        }
    }

    bounce() {
        if (this.hasBounced) return

        this.hasBounced = true

        this.yVel = this.calculatedStartYVel / 2
    }

    die() {
        this.dead = true
    }
}
