import { IDemolishable } from '../../interface/IDemolishable'
import { ISprite, Sprite, SpriteOptions } from './Sprite'

export interface IAdvancedSprite extends ISprite, IDemolishable {

}

export interface AdvancedSpriteOptions extends SpriteOptions {

}

export class AdvancedSprite extends Sprite implements IAdvancedSprite {
    constructor(options: AdvancedSpriteOptions) {
        super(options)

        // const spr = new PIXI.
        // this.
    }
}
