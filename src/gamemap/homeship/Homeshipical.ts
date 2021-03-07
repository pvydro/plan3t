import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { Container, IContainer } from '../../engine/display/Container'
import { IRect } from '../../engine/math/Rect'
import { ShowCollisionDebug } from '../../utils/Constants'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { HomeshipicalBuilder, IHomeshipicalBuilder } from './HomeshipicalBuilder'

export interface IHomeshipical extends IContainer {
    collisionRects: IRect[]
    tileLayer?: Container
    initializeHomeshipical(): Promise<void>
}

export class Homeshipical extends Container implements IHomeshipical {
    collisionRects: IRect[]
    collisionDebugger: CollisionDebugger
    tileLayer?: Container
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

    initializeHomeshipical(): Promise<void> {
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
