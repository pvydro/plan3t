import { Container } from '../../engine/display/Container'
import { IRect } from '../../engine/math/Rect'
import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { HomeshipicalBuilder, IHomeshipicalBuilder } from './HomeshipicalBuilder'
import { HomeshipicalModuleBuilder, IHomeshipicalModuleBuilder } from './HomeshipicalModuleBuilder'
import { HomeshipicalOutline } from './HomeshipicalOutline'

export interface IHomeshipical extends IGameMapContainer {
    groundRect: IRect
}

export interface HomeshipicalRespone extends SphericalResponse {
}

export class Homeshipical extends GameMapContainer implements IHomeshipical {
    private static INSTANCE: Homeshipical
    builder: IHomeshipicalBuilder
    moduleBuilder: IHomeshipicalModuleBuilder
    outline: HomeshipicalOutline
    moduleLayer: Container

    static getInstance() {
        if (Homeshipical.INSTANCE === undefined) {
            Homeshipical.INSTANCE = new Homeshipical()
        }

        return Homeshipical.INSTANCE
    }

    private constructor() {
        super()

        const homeship = this

        this.builder = new HomeshipicalBuilder({ homeship })
        this.moduleBuilder = new HomeshipicalModuleBuilder({ homeship })
        this.outline = new HomeshipicalOutline({ homeship })
    }

    initializeMap(): Promise<void> {
        if (this.tileLayer !== undefined) {
            this.clearMap()
        }

        return new Promise((resolve) => {
            this.builder.buildLocalHomeshipical().then((response: HomeshipicalRespone) => {
                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects
                this.moduleLayer = this.moduleBuilder.buildHomeshipicalModules()

                this.addChild(this.tileLayer)
                this.addChild(this.outline)
                this.addChild(this.moduleLayer)
                
                this.outline.initialize()

                super.initializeMap()
                
                resolve()
            })
        })
    }

    clearMap() {
        this.removeChild(this.outline)

        return super.clearMap()
    }

    get groundRect() {
        return this.collisionRects[0]
    }
}
