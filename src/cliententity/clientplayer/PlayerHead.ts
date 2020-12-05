import * as PIXI from 'pixi.js'
import { Container } from '../../display/Container'
import { Sprite } from '../../display/Sprite'
import { Dimension } from '../../math/Dimension'
import { Assets, AssetUrls } from '../../asset/Assets'
import { IClientPlayer } from './ClientPlayer'

export interface IPlayerHead {

}

export interface PlayerHeadOptions {
    player: IClientPlayer
}

export class PlayerHead extends Container {
    headSprite: Sprite

    constructor(options: PlayerHeadOptions) {
        super()

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HEAD_ASTRO))
        this.headSprite = new Sprite({ texture })
        this.headSprite.anchor.set(0.5, 0.5)

        // this.headSprite.dimension = new Dimension(64, 64)

        this.addChild(this.headSprite)
    }
}
