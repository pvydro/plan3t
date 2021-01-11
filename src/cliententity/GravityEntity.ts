import { IRect, Rect } from '../engine/math/Rect'
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
}

export class GravityEntity extends ClientEntity {
    _currentGroundRect?: Rect
    _onGround: boolean = false
    horizontalFriction: number
    boundingBox: IRect
    weight: number

    constructor(options?: GravityEntityOptions) {
        super()

        this.horizontalFriction = (options && options.horizontalFriction) ?? 5
        this.boundingBox = (options && options.boundingBox) ?? new Rect(0, 0, this.width, this.height)
        this.weight = (options && options.weight) ?? 0
    }

    update() {
        // Check if on ground based on current rect
        if (this._currentGroundRect) {
            const centerX = this.x

            if (centerX < this._currentGroundRect.x
            || centerX > this._currentGroundRect.x + this._currentGroundRect.width) {
                this._onGround = false
            }
        }

        // Increase vertical velocity if not on ground
        if (this.isOnGround === false) {
            this.yVel += (this.weight / 3) * GravityConstants.DropAcceleration // * GravityManager.gravity
        } else {
            this.yVel = 0
        }
    }

    comeToStop() {
        const xVel = this.xVel + (0 - this.xVel) / this.horizontalFriction

        this.xVel = xVel
    }

    landedOnGround(groundRect: Rect) {
        this._onGround = true

        this._currentGroundRect = groundRect
    }

    get isOnGround() {
        return this._onGround
    }
}
