import { GameMapContainer } from '../../gamemap/GameMapContainer'
import { log } from '../../service/Flogger'

export interface IWaveLevelManager {
    findNewLevel(): Promise<GameMapContainer>
}

export class WaveLevelManager implements IWaveLevelManager {
    constructor() {
        
    }

    findNewLevel(): Promise<GameMapContainer> {
        log('WaveLevelManager', 'findNewLevel')
        
        throw new Error('Method not implemented.')
    }
}
