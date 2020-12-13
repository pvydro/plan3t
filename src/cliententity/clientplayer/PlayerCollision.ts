import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { Container } from '../../engine/display/Container'
import { Rect } from '../../engine/math/Rect'
import { IUpdatable } from '../../interface/IUpdatable'
import { ShowCollisionDebug } from '../../utils/Constants'
import { ClientPlayer } from './ClientPlayer'

export interface IPlayerCollision extends IUpdatable {
    boundingBox: Rect
}

export interface PlayerCollisionOptions {
    player: ClientPlayer
}

export class PlayerCollision extends Container implements IPlayerCollision {
    _boundingBox?: Rect
    debugger: CollisionDebugger
    player: ClientPlayer

    constructor(options: PlayerCollisionOptions) {
        super()
        this.player = options.player

        if (ShowCollisionDebug) {
            this.debugger = new CollisionDebugger({
                collisionRects: [ this.boundingBox ]
            })

            this.debugger.initializeAndShowGraphics()

            this.addChild(this.debugger)
        }
    }

    update() {
    }

    get boundingBox() {
        if (this._boundingBox === undefined) {
            const width = this.player.body.width / 2
            const height = this.player.body.height
            this._boundingBox = new Rect(-width / 2, -height / 2, width, height)
        }

        return this._boundingBox
    }
}
