import { CollisionDebugger } from '../engine/collision/CollisionDebugger'
import { Container, IContainer } from '../engine/display/Container'
import { Rect } from '../engine/math/Rect'
import { IUpdatable } from '../interface/IUpdatable'
import { DebugConstants } from '../utils/Constants'

export interface IGameMapContainer extends IContainer, IUpdatable {
    collisionRects: Rect[]
    tileLayer?: Container
    initializeMap(): Promise<void>
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

    async initializeMap(): Promise<void> {
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

    clearMap() {
        this.collisionRects = []
        if (this.tileLayer !== undefined) {
            this.tileLayer.demolish()
            this.removeChild(this.tileLayer)
        }
    }
}
