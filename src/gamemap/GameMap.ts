import { Container } from 'pixi.js'
import { GameMapHelper } from './GameMapHelper'
import { IDemolishable } from '../interface/IDemolishable'
import { LoggingService } from '../service/LoggingService'

export interface IGameMap extends IDemolishable {
    temporaryGroundLevel: number
    initializeSpherical(): void
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

    initializeSpherical() {
        LoggingService.log('GameMap', 'initializeSpherical')
        // GameMapHelper.
    }

    demolish(): void {
        LoggingService.log('GameMap', 'demolish')
    }
}
