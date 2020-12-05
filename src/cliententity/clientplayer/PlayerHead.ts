import * as PIXI from 'pixi.js'
import { Container } from '../../display/Container'
import { Sprite } from '../../display/Sprite'
import { Assets, AssetUrls } from '../../asset/Assets'
import { IClientPlayer, PlayerBodyState } from './ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'
import { Events } from '../../utils/Constants'

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

        this.player.emitter.on(Events.PlayerWalkEnd, () => {
            console.log('walkend')
            this.swapHeadBobState()
        })
    }

    update() {
        const state = this.player.bodyState

        this.bobHead()
        
        const bobEaseAmt = this.player.bodyState === PlayerBodyState.Walking ? 20 : 50//25 : 50
        this.headBobOffset += (this.targetHeadBobOffset - this.headBobOffset) / bobEaseAmt

        this.position.y = -10 + this.headBobOffset
    }

    bobHead() {
        const graceSpace = 0.25

        if (this.player.bodyState !== PlayerBodyState.Walking) {
            if (Math.abs(this.headBobOffset) > (Math.abs(this.targetHeadBobOffset) - graceSpace)) {
                this.swapHeadBobState()
            }
        }
    }

    swapHeadBobState() {
        const targetBobAmt = this.player.bodyState === PlayerBodyState.Walking ? 1.25 : 1

        this.headBobState = this.headBobState === 'up' ? 'down' : 'up'
        this.targetHeadBobOffset = this.headBobState === 'up' ? -targetBobAmt : targetBobAmt
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
