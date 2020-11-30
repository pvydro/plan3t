import * as PIXI from 'pixi.js'
import { Container } from '../../utils/Container'
import { Sprite } from '../../utils/Sprite'
import { Assets, AssetUrls } from '../../asset/Assets'
import { IClientPlayer, ClientPlayer } from './ClientPlayer'

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

        this.addChild(this.headSprite)
    }
}
