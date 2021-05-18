import { GameLoop } from '../../../gameloop/GameLoop'
import { ICanDie } from '../../../interface/ICanDie'
import { ParticleManager } from '../../../manager/particlemanager/ParticleManager'
import { IRect } from '../../math/Rect'
import { Graphix } from '../Graphix'
import { IParticle, Particle, ParticleOptions } from './Particle'

export interface IGravityParticle extends IParticle, ICanDie {
    landedOnGround(ground: IRect): void
}

export interface GravityParticleOptions extends ParticleOptions {
    color?: number
    totalParticles?: number
    weight?: number
    yVelAcceleration?: number
    minStartYVel?: number
}

export class GravityParticle extends Particle implements IGravityParticle {
    dead: boolean
    xVel: number
    yVel: number
    yVelAcceleration: number
    onGround: boolean
    currentGroundRect?: IRect
    hasBounced: boolean
    minimumLifespan: number
    lifespanRandomizationRange: number 
    lifespanCountdown: number
    calculatedStartYVel: number
    xSpreadRange: number
    ySpreadRange: number
    weight: number

    constructor(options: GravityParticleOptions) {
        const negative = (Math.random() > 0.5) === true
        const minimumStartYVel = options.minStartYVel ?? 0
        if (options.sprite === undefined) {
            const genericColor = options.color ?? 0xb8b8b8
            const dustSize = 2
            const dustSquare = new Graphix()

            dustSquare.beginFill(genericColor)
            dustSquare.drawRect(0, 0, dustSize, dustSize)
            dustSquare.endFill()
            options.sprite = dustSquare
        }
        super(options)
        
        this.xSpreadRange = 1
        this.ySpreadRange = 3
        this.onGround = false
        this.hasBounced = false
        this.minimumLifespan = 60
        this.weight = options.weight ?? 1
        this.lifespanRandomizationRange = 20
        this.lifespanCountdown = this.minimumLifespan + Math.random() * this.lifespanRandomizationRange
        this.xVel = Math.random() * this.xSpreadRange
        this.calculatedStartYVel = -Math.random() * this.ySpreadRange
        this.yVelAcceleration = options.yVelAcceleration
        this.yVel = minimumStartYVel + this.calculatedStartYVel * this.weight

        if (negative) {
            this.xVel *= -1
        }
    }

    update() {
        super.update()

        // Lifespan
        if (this.dead) {
            this.alpha -= 0.15
            if (this.alpha <= 0) {
                this.demolish()
            }
            return
        }

        // Physics
        if (this.onGround === false) this.yVel += (this.yVelAcceleration)

        this.xVel += (0 - this.xVel) / 10
        this.x += this.xVel
        this.y += this.yVel
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

    demolish() {
        ParticleManager.getInstance().removeParticle(this)
        delete this.sprite
    }
}
