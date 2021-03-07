import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { HomeshipicalBuilder, IHomeshipicalBuilder } from './HomeshipicalBuilder'
import { HomeshipicalOutline } from './HomeshipicalOutline'

export interface IHomeshipical extends IGameMapContainer {

}

export interface HomeshipicalRespone extends SphericalResponse {

}

export class Homeshipical extends GameMapContainer implements IHomeshipical {
    private static INSTANCE: Homeshipical
    builder: IHomeshipicalBuilder
    outline: HomeshipicalOutline

    static getInstance() {
        if (Homeshipical.INSTANCE === undefined) {
            Homeshipical.INSTANCE = new Homeshipical()
        }

        return Homeshipical.INSTANCE
    }

    private constructor() {
        super()

        const homeship = this

        this.builder = new HomeshipicalBuilder()
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

                this.addChild(this.tileLayer)
                this.addChild(this.outline)
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
}
