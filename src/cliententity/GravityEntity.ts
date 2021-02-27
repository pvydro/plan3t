import { Koini } from '../creature/koini/Koini'
import { CollisionDebugger } from '../engine/collision/CollisionDebugger'
import { Direction } from '../engine/math/Direction'
import { IRect, Rect } from '../engine/math/Rect'
import { IVector2, Vector2 } from '../engine/math/Vector2'
import { GameLoop } from '../gameloop/GameLoop'
import { GravityConstants } from '../utils/Constants'
import { ClientEntity, ClientEntityOptions, IClientEntity } from './ClientEntity'

export interface IGravityEntity extends IClientEntity {
    isOnGround: boolean
    currentGroundRect: Rect
    direction: Direction
    comeToStop(): void
    landedOnGround(groundRect: Rect): void
}

export interface GravityEntityOptions extends ClientEntityOptions {
    horizontalFriction?: number
    boundingBox?: IRect
    boundingBoxAnchor?: IVector2
    weight?: number
    addDebugRectangle?: boolean
}

export class GravityEntity extends ClientEntity {
    _currentGroundRect?: Rect
    _onGround: boolean = false
    _direction: Direction = Direction.Right
    horizontalFriction: number
    boundingBox: IRect
    weight: number
    debugger?: CollisionDebugger

    constructor(options?: GravityEntityOptions) {
        super(options)

        this.horizontalFriction = (options && options.horizontalFriction) ?? 5
        this.weight = (options && options.weight) ?? 0
        this.boundingBox = this.createBoundingBox(options)//(options && options.boundingBox) ?? { x: 0, y: 0, width: this.width, height: this.height }

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
        let xVel = this.xVel + (0 - this.xVel) / this.horizontalFriction

        if (xVel < 0.01 && xVel > -0.01) {
            xVel = 0
        }

        this.xVel = xVel
    }

    landedOnGround(groundRect: Rect) {
        this.onGround = true

        this._currentGroundRect = groundRect
    }

    private createBoundingBox(options?: GravityEntityOptions): IRect {
        const boundingBoxAnchor: IVector2 = (options && options.boundingBoxAnchor) ?? Vector2.Zero
        const anchorXOffset = -this.width * boundingBoxAnchor.x
        const anchorYOffset = -this.height * boundingBoxAnchor.y
        const boundingBox: IRect = (options && options.boundingBox) ?? {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height 
        }


        boundingBox.x += anchorXOffset
        boundingBox.y += anchorYOffset

        return boundingBox
        // return { width: 0, height: 0, x: 0, y: 0 }
    }

    get isOnGround() {
        return this._onGround
    }

    set onGround(value: boolean) {
        this._onGround = value
    }

    get currentGroundRect(): Rect {
        return this._currentGroundRect
    }

    set direction(value: Direction) {
        this._direction = value
    }

    get direction() {
        return this._direction
    }
}
