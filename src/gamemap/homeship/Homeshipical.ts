import { Container } from '../../engine/display/Container'
import { IRect } from '../../engine/math/Rect'
import { GameMapContainer, GameMapContainerBuilderResponse, IGameMapContainer } from '../GameMapContainer'
import { SphericalResponse } from '../spherical/SphericalBuilder'
import { HomeshipicalBuilder, IHomeshipicalBuilder } from './HomeshipicalBuilder'
import { HomeshipicalModuleBuilder, IHomeshipicalModuleBuilder } from './HomeshipicalModuleBuilder'
import { HomeshipicalOutline } from './HomeshipicalOutline'
import { HomeshipicalModule } from './modules/HomeshipicalModule'

export interface IHomeshipical extends IGameMapContainer {
    groundRect: IRect
}

export class Homeshipical extends GameMapContainer implements IHomeshipical {
    private static Instance: Homeshipical
    builder: IHomeshipicalBuilder
    moduleBuilder: IHomeshipicalModuleBuilder
    outline: HomeshipicalOutline
    moduleLayer: Container
    modules: HomeshipicalModule[]

    static getInstance() {
        if (Homeshipical.Instance === undefined) {
            Homeshipical.Instance = new Homeshipical()
        }

        return Homeshipical.Instance
    }

    private constructor() {
        super()

        const homeship = this

        this.builder = new HomeshipicalBuilder()
        this.moduleBuilder = new HomeshipicalModuleBuilder({ homeship })
        this.outline = new HomeshipicalOutline({ homeship })
    }

    update() {
        for (const i in this.modules) {
            const m = this.modules[i]

            m.update()
        }
    }

    initializeMap(): Promise<void> {
        if (this.tileLayer !== undefined) {
            this.clearMap()
        }

        return new Promise((resolve) => {
            this.builder.buildLocalHomeshipical().then((response: GameMapContainerBuilderResponse) => {
                const moduleResponse = this.moduleBuilder.buildHomeshipicalModules()

                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects
                this.moduleLayer = moduleResponse.moduleContainer
                this.modules = moduleResponse.modules

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

    demolish() {
        this.outline.demolish()
        this.clearChildren()
    }

    get groundRect() {
        return this.collisionRects[0]
    }
}
