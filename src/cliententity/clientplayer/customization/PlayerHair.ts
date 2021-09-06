import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../../../engine/display/Sprite'
import { PlayerHairType } from '../../../model/PlayerCustomizationTypes'
import { IPlayerHead } from '../bodyparts/PlayerHead'
import { IPlayerCustomizationPiece, PlayerCustomizationPiece } from './PlayerCustomizationPiece'

export interface IPlayerHair extends IPlayerCustomizationPiece {
    setHead(head: IPlayerHead)
}

export class PlayerHair extends PlayerCustomizationPiece implements IPlayerHair {
    hairSprite: Sprite
    head: IPlayerHead

    constructor(type: PlayerHairType) {
        super()

        const url = `${Assets.CustomizationDir}hair/${type}`
        const texture = PIXI.Texture.from(Assets.get(url))

        this.hairSprite = new Sprite({ texture })

        this.addChild(this.hairSprite)

        this.hairSprite.x -= this.hairSprite.halfWidth
    }

    update() {
        super.update()

        if (this.head) {
            this.hairSprite.y = -26
        }
    }
    
    setHead(head: IPlayerHead) {
        this.head = head
    }
}
