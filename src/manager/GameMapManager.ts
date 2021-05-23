import { Key } from 'ts-keycode-enum'
import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { GameMap } from '../gamemap/GameMap'
import { MapBuildingType } from '../gamemap/mapbuilding/MapBuilding'
import { SphericalData } from '../gamemap/spherical/SphericalData'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
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
    _initialized: boolean = false
    _gameMap?: GameMap
    clientManager: IClientManager

    constructor() {
        this.clientManager = ClientManager.getInstance()
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

        let dojo = false
        InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
            if (event.which === Key.N) {
                this.transitionToMap(dojo ? MapBuildingType.Castle : MapBuildingType.Dojo)
                dojo = !dojo
            }
        })
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
