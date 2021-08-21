import { IClientPlayer } from "../ClientPlayer"

export interface ISuperMe {

}

export interface SuperMeOptions {
    player: IClientPlayer
}

export interface SuperMeSpriteOptions {
    headUrl: string
}

export class SuperMe implements ISuperMe {
    player: IClientPlayer

    constructor(options: SuperMeOptions) {
        this.player = options.player
    }

    applyNewSprites(options: SuperMeSpriteOptions) {
        
    }
}
