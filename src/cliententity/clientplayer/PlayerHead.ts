import * as PIXI from 'pixi.js'
import { Container } from '../../display/Container'
import { Sprite } from '../../display/Sprite'
import { Assets, AssetUrls } from '../../asset/Assets'
import { IClientPlayer, PlayerBodyState } from './ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'

export interface IPlayerHead extends IUpdatable {

}

export interface PlayerHeadOptions {
    player: IClientPlayer
}

export class PlayerHead extends Container {
    player: IClientPlayer
    headSprite: Sprite
    currentDirection: Direction = Direction.Right

    headBobOffset = 0
    targetHeadBobOffset = 0
    headBobState = 'up'

    constructor(options: PlayerHeadOptions) {
        super()
        this.player = options.player

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HEAD_ASTRO))
        this.headSprite = new Sprite({ texture })
        this.headSprite.anchor.set(0.475, 0.5)

        this.addChild(this.headSprite)
    }

    update() {
        const state = this.player.bodyState

        if (state === PlayerBodyState.Idle) {
            this.bobHead()
        } else {
            this.targetHeadBobOffset = 0
        }

        this.headBobOffset += (this.targetHeadBobOffset - this.headBobOffset) / 50

        this.position.y = -10 + this.headBobOffset
    }

    bobHead() {
        if (Math.abs(this.headBobOffset) > (Math.abs(this.targetHeadBobOffset) - 0.25)) {
            this.headBobState = this.headBobState === 'up' ? 'down' : 'up'
        }

        this.targetHeadBobOffset = this.headBobState === 'up' ? -1 : 1
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
