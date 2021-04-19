import { Container } from '../../engine/display/Container'
import { IRect } from '../../engine/math/Rect'
import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { HomeshipicalBuilder, IHomeshipicalBuilder } from './HomeshipicalBuilder'
import { HomeshipicalModuleBuilder, IHomeshipicalModuleBuilder } from './HomeshipicalModuleBuilder'
import { HomeshipicalOutline } from './HomeshipicalOutline'
import { HomeshipicalModule } from './modules/HomeshipicalModule'

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
    modules: HomeshipicalModule[]

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

    update() {
        for (var i in this.modules) {
            const m = this.modules[i]

            m.update()
        }
    }

    initializeMap(): Promise<void> {
        if (this.tileLayer !== undefined) {
            this.clearMap()
        }

        return new Promise((resolve) => {
            this.builder.buildLocalHomeshipical().then((response: HomeshipicalRespone) => {
                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects
                const moduleResponse = this.moduleBuilder.buildHomeshipicalModules()
                this.moduleLayer = moduleResponse.moduleContainer
                this.modules = moduleResponse.modules

                this.addChild(this.tileLayer)
                // this.addChild(this.outline) TODO FIXME Bring this back
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

    demolish() {
        this.outline.demolish()
        this.clearChildren()
    }

    get groundRect() {
        return this.collisionRects[0]
    }
}
