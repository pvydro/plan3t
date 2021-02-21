import { Sprite } from '../../../../engine/display/Sprite'
import { BushHelper } from './BushHelper'
import { INature, Nature, NatureOptions } from './Nature'

export enum BushType {
    TicBerry
}

export interface IBush extends INature {

}

export interface BushOptions extends NatureOptions {
    type: BushType
}

export class Bush extends Nature implements IBush {
    sprite: Sprite
    
    constructor(options: BushOptions) {
        super(options)

        const texture = BushHelper.getTextureForBushType(options.type)

        this.sprite = new Sprite({ texture })
    }
}
