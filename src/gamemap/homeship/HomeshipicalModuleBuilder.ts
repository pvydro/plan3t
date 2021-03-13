import { Container } from '../../engine/display/Container'
import { Flogger } from '../../service/Flogger'
import { IHomeshipical } from './Homeshipical'
import { BeamMeUpModule } from './modules/beammeup/BeamMeUpModule'
import { HomeshipicalModule } from './modules/HomeshipicalModule'

export interface IHomeshipicalModuleBuilder {
    buildHomeshipicalModules(): HomeshipicalModuleResponse
}

export interface HomeshipicalModuleBuilderOptions {
    homeship: IHomeshipical
}

export interface HomeshipicalModuleResponse {
    moduleContainer: Container
    modules: HomeshipicalModule[]
}

export class HomeshipicalModuleBuilder implements IHomeshipicalModuleBuilder {
    homeship: IHomeshipical

    constructor(options: HomeshipicalModuleBuilderOptions) {
        this.homeship = options.homeship
    }

    buildHomeshipicalModules(): HomeshipicalModuleResponse {
        Flogger.log('HomeshipicalModuleBuilder', 'buildHomeshipicalModules')

        const moduleContainer = new Container()
        const beamMeUp = new BeamMeUpModule()
        const shipModules: HomeshipicalModule[] = [
            beamMeUp
        ]

        moduleContainer.addChild(beamMeUp)

        // const homeship = this.homeship
        // const groundRect = homeship ? homeship.collisionRects

        // TODO All not being kalled
        if (this.homeship !== undefined && this.homeship.groundRect !== undefined) {
            const groundRect = this.homeship.groundRect

            if (groundRect !== undefined) {
                for (var i in shipModules) {
                    const shipModule = shipModules[i]
        
                    shipModule.attachToGround(groundRect)
                }
            }
        }

        return {
            moduleContainer,
            modules: shipModules
        }
    }
}
