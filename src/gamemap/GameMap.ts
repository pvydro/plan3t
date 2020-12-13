import { Container } from 'pixi.js'
import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { LoggingService } from '../service/LoggingService'
import { Game } from '../main/Game'

export interface IGameMap extends IDemolishable {
    temporaryGroundLevel: number
    initializeSpherical(): Promise<void>
    demolish(): void
}

export interface GameMapOptions {

}

export class GameMap extends Container implements IGameMap {
    temporaryGroundLevel = 0
    
    constructor(options?: GameMapOptions) {
        super()
        // createGameMap(seed?)
        // GameMapHelper.parseSphericalToArray()
        // GameMapHelper.parseSphericalToContainer(options?)
    }

    // TODO: Seed
    async initializeSpherical(seed?: string) {
        LoggingService.log('GameMap', 'initializeSpherical')

        GameMapHelper.getRandomSpherical().then((spherical) => {
            console.log('Spherical', spherical)
        })
    }

    demolish(): void {
        LoggingService.log('GameMap', 'demolish')
    }
}
