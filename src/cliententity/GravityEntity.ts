import { Koini } from '../creature/koini/Koini'
import { CollisionDebugger } from '../engine/collision/CollisionDebugger'
import { IRect, Rect } from '../engine/math/Rect'
import { GameLoop } from '../gameloop/GameLoop'
import { GravityConstants } from '../utils/Constants'
import { ClientEntity, ClientEntityOptions, IClientEntity } from './ClientEntity'

export interface IGravityEntity extends IClientEntity {
    isOnGround: boolean
    comeToStop(): void
    landedOnGround(groundRect: Rect): void
}

export interface GravityEntityOptions extends ClientEntityOptions {
    horizontalFriction?: number
    boundingBox?: IRect
    weight?: number
    addDebugRectangle?: boolean
}

export class GravityEntity extends ClientEntity {
    _currentGroundRect?: Rect
    _onGround: boolean = false
    horizontalFriction: number
    boundingBox: IRect
    weight: number
    debugger?: CollisionDebugger

    constructor(options?: GravityEntityOptions) {
        super(options)

        this.horizontalFriction = (options && options.horizontalFriction) ?? 5
        this.boundingBox = (options && options.boundingBox) ?? { x: 0, y: 0, width: this.width, height: this.height }
        this.weight = (options && options.weight) ?? 0

        if (options && options.addDebugRectangle === true) {
            this.debugger = new CollisionDebugger({
                collisionRects: [ this.boundingBox ]
            })

            this.addChild(this.debugger)
        }
    }

    update() {
        // Check if on ground based on current rect
        if (this._currentGroundRect) {
            const centerX = this.x

            if (centerX < this._currentGroundRect.x
            || centerX > this._currentGroundRect.x + this._currentGroundRect.width) {
                this.onGround = false
            }
        }

        // Increase vertical velocity if not on ground
        if (this.isOnGround === false) {
            this.yVel += ((this.weight / 3) * GravityConstants.DropAcceleration) * GameLoop.Delta
        } else {
            this.yVel = 0
        }

        super.update()
    }

    comeToStop() {
        const xVel = this.xVel + (0 - this.xVel) / this.horizontalFriction

        this.xVel = xVel
    }

    landedOnGround(groundRect: Rect) {
        this.onGround = true

        this._currentGroundRect = groundRect
    }

    get isOnGround() {
        return this._onGround
    }

    set onGround(value: boolean) {
        this._onGround = value
    }
}
