import * as PIXI from 'pixi.js'
import { Container } from '../../display/Container'
import { Sprite } from '../../display/Sprite'
import { Assets, AssetUrls } from '../../asset/Assets'
import { ClientPlayer, PlayerBodyState } from './ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'
import { Events } from '../../utils/Constants'
import { IPlayerHeadController, PlayerHeadController } from './PlayerHeadController'

export interface IPlayerHead extends IUpdatable {

}

export interface PlayerHeadOptions {
    player: ClientPlayer
}

export class PlayerHead extends Container {
    player: ClientPlayer
    controller: IPlayerHeadController
    headSprite: Sprite
    currentDirection: Direction = Direction.Right

    headBobOffset = 0
    targetHeadBobOffset = 0
    headBobState = 'up'

    constructor(options: PlayerHeadOptions) {
        super()
        this.player = options.player
        this.controller = new PlayerHeadController({
            playerHead: this,
            player: this.player
        })

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HEAD_HUMAN_DEFAULT))
        this.headSprite = new Sprite({ texture })
        this.headSprite.anchor.set(0.475, 0.9)

        this.addChild(this.headSprite)

        // Bob head when walking
        this.player.emitter.on(Events.PlayerWalkBounce, () => {
            this.swapHeadBobState()
        })
    }

    update() {
        this.bobHead()
        
        const bobEaseAmt = this.player.bodyState === PlayerBodyState.Walking ? 8 : 50
        this.headBobOffset += (this.targetHeadBobOffset - this.headBobOffset) / bobEaseAmt

        this.position.y = -3 + this.headBobOffset

        this.controller.update()
    }

    bobHead() {
        const graceSpace = 0.25

        if (this.player.bodyState == PlayerBodyState.Idle) {
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
