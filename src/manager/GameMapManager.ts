import { CameraLayer } from '../camera/CameraStage'
import { GameMap } from '../gamemap/GameMap'
import { MapBuildingType } from '../gamemap/mapbuilding/MapBuilding'
import { MultiStoryMapBuilding } from '../gamemap/mapbuilding/MultiStoryMapBuilding'
import { SphericalData } from '../gamemap/spherical/SphericalData'
import { IUpdatable } from '../interface/IUpdatable'
import { Flogger } from '../service/Flogger'
import { ClientManager, IClientManager } from './ClientManager'

export interface IGameMapManager extends IUpdatable {
    gameMap: GameMap
    initialize(sphericalData?: SphericalData): Promise<void>
    initializeRandomSpherical(): Promise<void>
    initializeHomeship(): Promise<void>
    initializeBuilding(type: MapBuildingType): Promise<void>
    transitionToMap(type: MapBuildingType): Promise<void>
}

export class GameMapManager implements IGameMapManager {
    private static Instance: IGameMapManager
    _initialized: boolean = false
    _gameMap: GameMap
    clientManager: IClientManager

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new GameMapManager()
        }

        return this.Instance
    }

    private constructor() {
        this.clientManager = ClientManager.getInstance()
        this._gameMap = GameMap.getInstance()
    }

    async initialize(sphericalData?: SphericalData) {
        Flogger.log('GameMapManager', 'initializeGameMap')
        
        if (this._initialized) {
            this.stage.removeFromLayer(this._gameMap, CameraLayer.GameMap)
        }

        this._initialized = true
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

    async initializeBuilding(type: MapBuildingType) {
        await this.initialize()

        return this._gameMap.initializeBuilding(type)
        // const building
    }

    async transitionToMap(type: MapBuildingType) {
        // if (this._gameMap.currentMap instanceof MultiStoryMapBuilding) {
        // }
        return this._gameMap.transitionToMap(type)
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
