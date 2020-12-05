import * as PIXI from 'pixi.js'
import { Container } from '../../display/Container'
import { Sprite } from '../../display/Sprite'
import { Assets, AssetUrls } from '../../asset/Assets'
import { IClientPlayer } from './ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'

export interface IPlayerHead extends IUpdatable {

}

export interface PlayerHeadOptions {
    player: IClientPlayer
}

export class PlayerHead extends Container {
    headSprite: Sprite
    currentDirection: Direction = Direction.Right

    constructor(options: PlayerHeadOptions) {
        super()

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HEAD_ASTRO))
        this.headSprite = new Sprite({ texture })
        this.headSprite.anchor.set(0.475, 0.5)

        this.addChild(this.headSprite)
    }

    update() {
        
    }

    set direction(value: Direction) {
        if (this.currentDirection !== value) {
            this.flipAllSprites()
        }
        this.currentDirection = value
    }

    flipAllSprites() {
        this.headSprite.scale.x *= -1
    }
}
