import { Assets } from '../../../asset/Assets'
import { Sprite } from '../../../engine/display/Sprite'
import { PlayerHairType } from '../../../model/PlayerCustomizationTypes'
import { IPlayerHead } from '../bodyparts/PlayerHead'
import { IPlayerCustomizationPiece, PlayerCustomizationPiece } from './PlayerCustomizationPiece'

export enum PlayerHairColor {
    Blonde = 0xccbe91,
    YellowBlonde = 0xe0c56c,
    Black = 0x545454,
    Purple = 0xb182d1,
    SlateBlue = 0x7b91b8,
    Silver = 0xb0b0b0
}

export interface IPlayerHair extends IPlayerCustomizationPiece {
    setHead(head: IPlayerHead)
}

export class PlayerHair extends PlayerCustomizationPiece implements IPlayerHair {
    hairSprite: Sprite
    hairColor: number = 0xe0c56c
    head: IPlayerHead

    constructor(type: PlayerHairType, color?: PlayerHairColor) {
        super()

        const url = `${Assets.CustomizationDir}hair/${type}`
        const texture = PIXI.Texture.from(Assets.get(url))

        this.hairSprite = new Sprite({ texture })

        this.addChild(this.hairSprite)

        this.hairSprite.x -= this.hairSprite.halfWidth
        this.hairSprite.tint = color ?? PlayerHairColor.Black
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
