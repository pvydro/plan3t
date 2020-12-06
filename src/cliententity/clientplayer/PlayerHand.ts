import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../display/Container'
import { Sprite } from '../../display/Sprite'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'
import { IClientPlayer } from './ClientPlayer'

export interface IPlayerHand extends IUpdatable {

}

export interface PlayerHandOptions {
    player: IClientPlayer
}

export class PlayerHand extends Container implements IPlayerHand {
    baseOffsetX: number = 2
    baseOffsetY: number = 3
    currentOffsetX: number = this.baseOffsetX

    player: IClientPlayer
    handSprite: Sprite

    constructor(options: PlayerHandOptions) {
        super()
        this.player = options.player

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HAND_HUMAN_DEFAULT))
        this.handSprite = new Sprite({ texture })
        this.handSprite.anchor.set(0.5, 0.5)
        
        this.addChild(this.handSprite)
    }

    update() {
        const direction = this.player.direction
        let baseOffsetX = direction === Direction.Right ? -this.baseOffsetX : this.baseOffsetX

        this.currentOffsetX += (baseOffsetX - this.currentOffsetX) / 3

        this.x = this.currentOffsetX
        this.y = this.baseOffsetY
    }
}
