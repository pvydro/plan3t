import { GameMap } from '../gamemap/GameMap'
import { Flogger } from '../service/Flogger'
import { IClientManager } from './ClientManager'

export interface IGameMapManager {
    gameMap: GameMap
    initialize()
}

export interface GameMapManagerOptions {
    clientManager: IClientManager
}

export class GameMapManager implements IGameMapManager {
    clientManager: IClientManager
    _gameMap?: GameMap

    constructor(options: GameMapManagerOptions) {
        this.clientManager = options.clientManager
    }

    async initialize() {
        Flogger.log('GameMapManager', 'initializeGameMap')

        if (this.gameMap !== undefined) {
            this.gameMap.demolish()
        }

        this._gameMap = GameMap.getInstance()
        
        await this._gameMap.initializeSpherical()

        this.stage.addChild(this._gameMap)
    }

    get stage() {
        return this.camera.stage
    }

    get viewport() {
        return this.camera.viewport
    }

    get camera() {
        return this.clientManager.clientCamera
    }

    get gameMap() {
        return this._gameMap
    }
}
