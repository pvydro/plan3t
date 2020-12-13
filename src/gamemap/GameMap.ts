import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { LoggingService } from '../service/LoggingService'
import { Spherical } from './spherical/Spherical'
import { Container } from '../engine/display/Container'
import { GlobalScale } from '../utils/Constants'

export interface IGameMap extends IDemolishable {
    initializeSpherical(): Promise<void>
    demolish(): void
}

export interface GameMapOptions {

}

export class GameMap extends Container implements IGameMap {
    
    constructor(options?: GameMapOptions) {
        super()

        this.scale.set(GlobalScale, GlobalScale)
    }

    // TODO: Seed
    async initializeSpherical(seed?: string) {
        LoggingService.log('GameMap', 'initializeSpherical')

        GameMapHelper.getRandomSphericalData().then((sphericalData) => {
            const spherical = new Spherical(sphericalData)

            this.addChild(spherical)
        })
    }

    demolish() {
        LoggingService.log('GameMap', 'demolish')
    }
}
