import { log } from '../../../service/Flogger'

export interface IPlayerCustomization {

}

export interface PlayerCustomizationConfig {

}

export class PlayerCustomization implements IPlayerCustomization {
    constructor() {

    }

    applyCustomization(config: PlayerCustomizationConfig) {
        log('PlayerCustomization', 'applyCustomization', config)
    }
}
