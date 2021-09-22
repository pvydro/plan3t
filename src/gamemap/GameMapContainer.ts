import { CollisionDebugger } from '../engine/collision/CollisionDebugger'
import { PositionAndAlphaAnimateable, PositionAnimateable } from '../engine/display/Animator'
import { Container, IContainer } from '../engine/display/Container'
import { Tween } from '../engine/display/tween/Tween'
import { Easing } from '../engine/display/tween/TweenEasing'
import { Rect } from '../engine/math/Rect'
import { GameLoop } from '../gameloop/GameLoop'
import { IUpdatable } from '../interface/IUpdatable'
import { log } from '../service/Flogger'
import { DebugConstants } from '../utils/Constants'
import { AnimDefaults } from '../utils/Defaults'
import { asyncTimeout } from '../utils/Utils'

export interface IGameMapContainer extends IContainer, IUpdatable {
    collisionRects: Rect[]
    tileLayer?: Container
    initializeMap(): Promise<void>
    transitionOut(outElements?: PositionAndAlphaAnimateable[]): Promise<void>
    transitionIn(outElements?: PositionAndAlphaAnimateable[]): Promise<void>
    clearMap(): void
}

export interface GameMapContainerBuilderResponse {
    tileLayer: Container
    natureLayer?: Container
    collisionRects?: Rect[]
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

    async transitionIn(outElements?: PositionAndAlphaAnimateable[]) {
        log('GameMapContainer', 'transitionIn')

        const swipeMargin = 24

        if (outElements !== undefined) {
            for (var toHide in outElements) {
                outElements[toHide].alpha = 0
                outElements[toHide].x += swipeMargin
            }

            for (var i in outElements) {
                const outEle = outElements[i]
                const targetX = outEle.x - swipeMargin

                Tween.to(outEle, {
                    x: targetX,
                    alpha: 1,
                    duration: 0.5,
                    ease: Easing.EaseOutQuad,
                    autoplay: true
                })

                await asyncTimeout(AnimDefaults.casecadeSpacing)
            }
        }

        GameLoop.CustomDelta = 1
        GameLoop.ShouldLoop = true
    }

    async transitionOut(outElements?: PositionAndAlphaAnimateable[]) {
        log('GameMapContainer', 'transitionOut')

        GameLoop.CustomDelta = 0
        GameLoop.ShouldLoop = false
        
        const swipeOutDistance = -2.4

        if (outElements !== undefined) {
            for (var i in outElements) {
                const outEle = outElements[i]
                const interpolation = { time: 0, alpha: 1 }

                Tween.to(interpolation, {
                    time: 1,
                    duration: 0.5,
                    alpha: 0,
                    ease: Easing.EaseOutCubic,
                    autoplay: true,
                    onUpdate: () => {
                        outEle.x += swipeOutDistance * interpolation.time
                        outEle.alpha = interpolation.alpha
                    }
                })

                await asyncTimeout(AnimDefaults.casecadeSpacing)
            }
        }

        await asyncTimeout(500)
    }

    clearMap() {
        this.collisionRects = []
        if (this.tileLayer !== undefined) {
            this.tileLayer.demolish()
            this.removeChild(this.tileLayer)
        }
    }
}
