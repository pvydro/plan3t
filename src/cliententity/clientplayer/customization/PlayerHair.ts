import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../../../engine/display/Sprite'
import { PlayerHairType } from '../../../model/PlayerCustomizationTypes'
import { IPlayerCustomizationPiece, PlayerCustomizationPiece } from './PlayerCustomizationPiece'

export interface IPlayerHair extends IPlayerCustomizationPiece {

}

export class PlayerHair extends PlayerCustomizationPiece implements IPlayerHair {
    hairSprite: Sprite

    constructor(type: PlayerHairType) {
        super()

        const url = `${Assets.CustomizationDir}hair/${type}`
        const texture = PIXI.Texture.from(Assets.get(url))

        this.hairSprite = new Sprite({ texture })

        this.addChild(this.hairSprite)

        this.hairSprite.x -= 3
        this.hairSprite.y -= 5
    }
}
