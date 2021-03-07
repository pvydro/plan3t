import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { ShowCollisionDebug } from '../../utils/Constants'
import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { HomeshipicalBuilder, IHomeshipicalBuilder } from './HomeshipicalBuilder'

export interface IHomeshipical extends IGameMapContainer {
}

export class Homeshipical extends GameMapContainer implements IHomeshipical {
    builder: IHomeshipicalBuilder
    private static INSTANCE: Homeshipical

    static getInstance() {
        if (Homeshipical.INSTANCE === undefined) {
            Homeshipical.INSTANCE = new Homeshipical()
        }

        return Homeshipical.INSTANCE
    }

    private constructor() {
        super()

        this.builder = new HomeshipicalBuilder()
    }

    initializeMap(): Promise<void> {
        if (this.tileLayer !== undefined) {
            this.clearMap()
        }

        return new Promise((resolve) => {
            this.builder.buildLocalHomeshipical().then((response: SphericalResponse) => {
                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects

                this.addChild(this.tileLayer)

                if (ShowCollisionDebug) {
                    this.collisionDebugger = new CollisionDebugger({
                        lineWidth: 0.5,
                        collisionRects: response.collisionRects
                    })

                    this.collisionDebugger.initializeAndShowGraphics()
                }

                resolve()
            })
        })
    }
}
