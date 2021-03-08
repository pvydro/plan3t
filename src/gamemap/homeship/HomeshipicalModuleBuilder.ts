import { Container } from '../../engine/display/Container'
import { Flogger } from '../../service/Flogger'
import { IHomeshipical } from './Homeshipical'
import { BeamMeUp } from './modules/beammeup/BeamMeUp'
import { HomeshipicalModule } from './modules/HomeshipicalModule'

export interface IHomeshipicalModuleBuilder {
    buildHomeshipicalModules(): Container
}

export interface HomeshipicalModuleBuilderOptions {
    homeship: IHomeshipical
}

export class HomeshipicalModuleBuilder implements IHomeshipicalModuleBuilder {
    homeship: IHomeshipical

    constructor(options: HomeshipicalModuleBuilderOptions) {
        this.homeship = options.homeship
    }

    buildHomeshipicalModules(): Container {
        Flogger.log('HomeshipicalModuleBuilder', 'buildHomeshipicalModules')

        const moduleContainer = new Container()
        const beamMeUp = new BeamMeUp()
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

        return moduleContainer
    }
}
