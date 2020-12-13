import { Container } from 'pixi.js'
import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { LoggingService } from '../service/LoggingService'
import { Spherical } from './spherical/Spherical'

export interface IGameMap extends IDemolishable {
    initializeSpherical(): Promise<void>
    demolish(): void
}

export interface GameMapOptions {

}

export class GameMap extends Container implements IGameMap {
    
    constructor(options?: GameMapOptions) {
        super()
        // createGameMap(seed?)
        // GameMapHelper.parseSphericalToArray()
        // GameMapHelper.parseSphericalToContainer(options?)
    }

    // TODO: Seed
    async initializeSpherical(seed?: string) {
        LoggingService.log('GameMap', 'initializeSpherical')

        GameMapHelper.getRandomSphericalData().then((sphericalData) => {
            LoggingService.log('GameMap', 'Spherical', sphericalData)

            const spherical = new Spherical(sphericalData)

            this.addChild(spherical)
        })
    }

    demolish() {
        LoggingService.log('GameMap', 'demolish')
    }
}
