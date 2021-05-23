import { CollisionDebugger } from '../engine/collision/CollisionDebugger'
import { PositionAndAlphaAnimateable, PositionAnimateable } from '../engine/display/Animator'
import { Container, IContainer } from '../engine/display/Container'
import { Tween } from '../engine/display/tween/Tween'
import { Easing } from '../engine/display/tween/TweenEasing'
import { Rect } from '../engine/math/Rect'
import { IUpdatable } from '../interface/IUpdatable'
import { log } from '../service/Flogger'
import { DebugConstants } from '../utils/Constants'

export interface IGameMapContainer extends IContainer, IUpdatable {
    collisionRects: Rect[]
    tileLayer?: Container
    initializeMap(): Promise<void>
    transitionOut(outElements?: PositionAndAlphaAnimateable[]): Promise<void>
    clearMap(): void
}

export interface GameMapContainerBuilderResponse {
    tileLayer: Container
    natureLayer?: Container
    collisionRects: Rect[]
}

export class GameMapContainer extends Container implements IGameMapContainer {
    collisionDebugger: CollisionDebugger
    collisionRects: Rect[]
    tileLayer?: Container

    constructor() {
        super()
    }

    update() {
        
    }

    async initializeMap() {
        if (this.collisionRects !== undefined) {
            if (DebugConstants.ShowCollisionDebug) {
                this.collisionDebugger = new CollisionDebugger({
                    lineWidth: 0.5,
                    collisionRects: this.collisionRects
                })

                this.addChild(this.collisionDebugger)
            }
        }
    }

    async transitionOut(outElements?: PositionAndAlphaAnimateable[]) {
        log('GameMapContainer', 'transitionOut')

        if (outElements !== undefined) {
            for (var i in outElements) {
                const outEle = outElements[i]
                const swipeOutDistance = -2.4
                const interpolation = { time: 0, alpha: 1 }

                await Tween.to(interpolation, {
                    time: 1,
                    duration: 0.5,
                    alpha: 0,
                    ease: Easing.EaseInCirc,
                    autoplay: true,
                    onUpdate: () => {
                        outEle.x += swipeOutDistance * interpolation.time
                        outEle.alpha = interpolation.alpha
                    }
                })
            }
        }
    }

    clearMap() {
        this.collisionRects = []
        if (this.tileLayer !== undefined) {
            this.tileLayer.demolish()
            this.removeChild(this.tileLayer)
        }
    }
}
