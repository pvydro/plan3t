import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../display/Sprite'
import { IUpdatable } from '../../interface/IUpdatable'

export interface IPlayerHand extends IUpdatable {

}

export interface PlayerHandOptions {

}

export class PlayerHand implements IPlayerHand {
    handSprite: Sprite

    constructor(options: PlayerHandOptions) {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HAND_HUMAN_DEFAULT))
        this.handSprite = new Sprite({ texture })
        this.handSprite.anchor.set(0.5, 0.5)
    }

    update() {

    }
}
