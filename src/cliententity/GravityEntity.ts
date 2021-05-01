import { CollisionDebugger } from '../engine/collision/CollisionDebugger'
import { IDimension } from '../engine/math/Dimension'
import { Direction } from '../engine/math/Direction'
import { Rect } from '../engine/math/Rect'
import { IVector2, Vector2 } from '../engine/math/Vector2'
import { GameLoop } from '../gameloop/GameLoop'
import { GlobalScale, GravityConstants } from '../utils/Constants'
import { PhysDefaults } from '../utils/Defaults'
import { ClientEntity, ClientEntityOptions, IClientEntity } from './ClientEntity'

export interface IGravityEntity extends IClientEntity {
    isOnGround: boolean
    isOnWallLeft: boolean
    isOnWallRight: boolean
    currentGroundRect: Rect
    direction: Direction
    gravityAnchor: IVector2
    boundingBox: Rect
    boundsWithPosition: Rect
    topY: number
    bottomY: number
    rightX: number
    leftX: number
    middleY: number
    comeToStop(): void
    landedOnGround(groundRect: Rect): void
    hitWall(wallRect: Rect): void
}

export interface GravityEntityOptions extends ClientEntityOptions {
    horizontalFriction?: number
    boundingBox?: Rect
    boundingDimensions?: IDimension
    boundingBoxAnchor?: IVector2
    gravityAnchor?: IVector2
    weight?: number
    addDebugRectangle?: boolean
}

export class GravityEntity extends ClientEntity {
    _currentGroundRect?: Rect
    _onGround: boolean = false
    _onWallLeft: boolean = false
    _onWallRight: boolean = false
    _direction: Direction = Direction.Right
    _boundsWithPosition: Rect
    _boundsWithVelocity: Rect
    gravityAnchor: IVector2 = Vector2.Zero
    horizontalFriction: number
    boundingBox: Rect
    weight: number
    debugger?: CollisionDebugger

    constructor(options?: GravityEntityOptions) {
        super(options)

        this.horizontalFriction = (options && options.horizontalFriction) ?? PhysDefaults.horizontalFriction
        this.weight = (options && options.weight) ?? PhysDefaults.weight
        this.boundingBox = this.createBoundingBox(options)

        if (options) {
            if (options.addDebugRectangle) {
                this.debugger = new CollisionDebugger({
                    collisionRects: this.boundingBox
                })
                this.addChild(this.debugger)
            }
            if (options.gravityAnchor) {
                this.gravityAnchor = options.gravityAnchor
            }
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
        const difference = groundRect.y - this.bottomY

        this.onGround = true
        this._currentGroundRect = groundRect
        this.yVel = difference
    }

    hitWall(wallRect: Rect) {
        if (this.middleX < wallRect.middleX) {
            this._onWallLeft = false
            this._onWallRight = true
        } else {
            this._onWallLeft = true
            this._onWallRight = false
        }
    }

    /**
     * Generates a bounding box for a GravityEntity using anchor & dimensions.
     * 
     * @param options Properties of the GravityEntity
     * @returns an IRect representing the newly generated bounding box
     */
    private createBoundingBox(options?: GravityEntityOptions): Rect {
        const passedWidth = (options.boundingBox && options.boundingBox.width) ?? (options.boundingDimensions && options.boundingDimensions.width)
        const passedHeight = (options.boundingBox && options.boundingBox.height) ?? (options.boundingDimensions && options.boundingDimensions.height)
        const width = passedWidth ?? this.width
        const height = passedHeight ?? this.height
        const boundingBoxAnchor: IVector2 = (options && options.boundingBoxAnchor) ?? Vector2.Zero
        const anchorXOffset = -width * boundingBoxAnchor.x
        const anchorYOffset = -height * boundingBoxAnchor.y
        const boundingBox: Rect = (options && options.boundingBox) ?? new Rect({
            x: anchorXOffset, y: this.height - height + anchorYOffset,
            width, height
        })
        
        this._boundsWithPosition = boundingBox
        this._boundsWithVelocity = boundingBox

        return boundingBox
    }

    get boundsWithPosition() {
        if (!this._boundsWithPosition) {
            this._boundsWithPosition = new Rect({
                x: this.x + this.halfWidth - (this.boundingBox.width / 2),
                y: this.y + this.height - this.boundingBox.height,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            })
        }
        
        if (this._boundsWithPosition.x !== this.x
        || this._boundsWithPosition.y !== this.y) {
            this._boundsWithPosition.x = this.x
            this._boundsWithPosition.y = this.y
        }

        return this._boundsWithPosition
    }

    get topY() {
        const heightOffsetMultiplier = -this.gravityAnchor.y ?? 0
        const heightOffset = this.boundingBox.height * heightOffsetMultiplier
        const entityTopY = this.y - ((this.boundingBox.height + heightOffset) * GlobalScale)

        return entityTopY
    }

    get bottomY() {
        const heightOffsetMultiplier = -this.gravityAnchor.y ?? 0
        const heightOffset = this.boundingBox.height * heightOffsetMultiplier
        const entityBottomY = this.y + ((this.boundingBox.height + heightOffset) * GlobalScale)

        return entityBottomY
    }

    get rightX() {
        return this.x + this.halfWidth
    }

    get leftX() {
        return this.x - this.halfWidth
    }

    get middleY() {
        return this.y
    }

    get middleX() {
        return this.x
    }

    get xVel() {
        return this._xVel
    }

    get yVel() {
        return this._yVel
    }

    get boundsWithVelocity() {
        return this._boundsWithVelocity
    }

    get isOnGround() {
        return this._onGround
    }

    get isOnWallLeft() {
        return this._onWallLeft
    }

    get isOnWallRight() {
        return this._onWallRight
    }

    set onGround(value: boolean) {
        this._onGround = value
    }

    get currentGroundRect(): Rect {
        return this._currentGroundRect
    }

    get direction() {
        return this._direction
    }

    set direction(value: Direction) {
        this._direction = value
    }

    set xVel(value: number) {
        // if (value > 0) {
        //     if (this.isOnWallRight) {
        //         value = 0
        //         // return
        //     } else if (this.isOnWallLeft) {
        //         this._onWallLeft = false
        //     }
        // } else if (value < 0) {
        //     if (this.isOnWallLeft) {
        //         value = 0
        //         // return
        //     } else if (this.isOnWallRight) {
        //         this._onWallRight = false
        //     }
        // }

        this._xVel = value
        this._boundsWithVelocity.x = this.boundsWithPosition.x + this._xVel
    }

    set yVel(value: number) {
        this._yVel = value
        this._boundsWithVelocity.y = this.boundsWithPosition.y + this._yVel
    }
}
