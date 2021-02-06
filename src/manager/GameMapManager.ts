import { GameMap } from '../gamemap/GameMap'
import { SphericalData } from '../gamemap/spherical/SphericalData'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger } from '../service/Flogger'
import { IClientManager } from './ClientManager'

export interface IGameMapManager extends IUpdatable {
    gameMap: GameMap
    initialize(sphericalData?: SphericalData): Promise<void>
    initializeRandomSpherical(): Promise<void>
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

    async initialize(sphericalData?: SphericalData) {
        Flogger.log('GameMapManager', 'initializeGameMap')

        this._gameMap = GameMap.getInstance()
        this.stage.addChild(this._gameMap)
        
        if (sphericalData !== undefined) {
            this._gameMap.initializePremadeSpherical(sphericalData)
        }
    }

    async initializeRandomSpherical() {
        await this.initialize()
        
        await this._gameMap.initializeRandomSpherical()
    }

    update() {
        if (this._gameMap) {
            this._gameMap.update()
        }
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
