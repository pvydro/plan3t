import { IRect, Rect } from '../engine/math/Rect'
import { ClientEntity, ClientEntityOptions, IClientEntity } from './ClientEntity'

export interface IGravityEntity extends IClientEntity {
    isOnGround: boolean
    comeToStop(): void
}

export interface GravityEntityOptions extends ClientEntityOptions {
    horizontalFriction?: number
    boundingBox?: IRect
    weight?: number
}

export class GravityEntity extends ClientEntity {
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
        if (this.isOnGround === false) {
            this.yVel += (this.weight / 3)
        } else {
            this.yVel = 0
        }
    }

    comeToStop() {
        const xVel = this.xVel + (0 - this.xVel) / this.horizontalFriction

        this.xVel = xVel
    }

    get isOnGround() {
        return this._onGround
    }
}
