import { MapBuildingType } from '../../gamemap/mapbuilding/MapBuilding'
import { log } from '../../service/Flogger'
import { GameMapManager, IGameMapManager } from '../GameMapManager'

export interface IWaveLevelManager {
    transitionToNewLevel(): Promise<void>
}

export class WaveLevelManager implements IWaveLevelManager {
    _dojo: boolean = false
    gameMapManager: IGameMapManager

    constructor() {
        this.gameMapManager = GameMapManager.getInstance()
    }

    async transitionToNewLevel() {
        log('WaveLevelManager', 'transitionToNewLevel')
        
        // const type = this.findNewLevelType()

        // await this.gameMapManager.transitionToMap(type)
    }

    private findNewLevelType(): MapBuildingType {
        this._dojo = !this._dojo
        
        return this._dojo ? MapBuildingType.Dojo : MapBuildingType.Castle
    }
}
