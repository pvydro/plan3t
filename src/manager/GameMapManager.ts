import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { GameMap } from '../gamemap/GameMap'
import { SphericalData } from '../gamemap/spherical/SphericalData'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger } from '../service/Flogger'
import { IClientManager } from './ClientManager'

export interface IGameMapManager extends IUpdatable {
    gameMap: GameMap
    initialize(sphericalData?: SphericalData): Promise<void>
    initializeRandomSpherical(): Promise<void>
    initializeHomeship(): Promise<void>
}

export interface GameMapManagerOptions {
    clientManager: IClientManager
}

export class GameMapManager implements IGameMapManager {
    _initialized: boolean = false
    _gameMap?: GameMap
    clientManager: IClientManager

    constructor(options: GameMapManagerOptions) {
        this.clientManager = options.clientManager
    }

    async initialize(sphericalData?: SphericalData) {
        Flogger.log('GameMapManager', 'initializeGameMap')
        
        if (this._initialized) {
            this.stage.removeFromLayer(this._gameMap, CameraLayer.GameMap)
        }

        this._initialized = true
        this._gameMap = GameMap.getInstance()
        this.stage.addChildAtLayer(this._gameMap, CameraLayer.GameMap)
        
        if (sphericalData !== undefined) {
            this._gameMap.initializePremadeSpherical(sphericalData)
        }
    }

    async initializeHomeship() {
        await this.initialize()

        return this._gameMap.initializeHomeship()
    }

    async initializeRandomSpherical() {
        await this.initialize()
        
        return this._gameMap.initializeRandomSpherical()
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
