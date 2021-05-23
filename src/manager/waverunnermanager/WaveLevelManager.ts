import { Key } from 'ts-keycode-enum'
import { GameMapContainer } from '../../gamemap/GameMapContainer'
import { MapBuildingType } from '../../gamemap/mapbuilding/MapBuilding'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
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

        InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
            if (event.which === Key.N) {
                this.transitionToNewLevel()
                // this.transitionToMap(dojo ? MapBuildingType.Castle : MapBuildingType.Dojo)
                // dojo = !dojo
            }
        })
    }

    async transitionToNewLevel() {
        log('WaveLevelManager', 'transitionToNewLevel')
        
        const type = this.findNewLevelType()

        this.gameMapManager.transitionToMap(type)
    }

    private findNewLevelType(): MapBuildingType {
        this._dojo = !this._dojo
        
        return this._dojo ? MapBuildingType.Dojo : MapBuildingType.Castle
    }
}
