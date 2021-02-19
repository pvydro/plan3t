import * as PIXI from 'pixi.js'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Assets, AssetUrls } from '../../asset/Assets'
import { ClientPlayer, PlayerBodyState, PlayerConsciousnessState, PlayerLegsState } from './ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../engine/math/Direction'
import { Events } from '../../utils/Constants'
import { IPlayerHeadController, PlayerHeadController } from './PlayerHeadController'

export interface IPlayerHead extends IUpdatable {
    headBobOffset: number
}

export interface PlayerHeadOptions {
    player: ClientPlayer
}

export class PlayerHead extends Container {
    player: ClientPlayer
    controller: IPlayerHeadController
    headSprite: Sprite
    currentDirection: Direction = Direction.Right

    _headBobOffset = 0
    _targetCrouchedOffset = 0
    _crouchedOffset = 0
    targetHeadBobOffset = 0
    headBobState = 'up'

    constructor(options: PlayerHeadOptions) {
        super()
        this.player = options.player
        this.controller = new PlayerHeadController({
            playerHead: this,
            player: this.player
        })

//
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HEAD_HUMAN_DEFAULT))
        this.headSprite = new Sprite({ texture })
        this.headSprite.anchor.set(0.475, 0.9)
//

        this.addChild(this.headSprite)

        // Bob head when walking
        this.player.emitter.on(Events.PlayerWalkBounce, () => {
            this.swapHeadBobState()
        })
    }

    update() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Alive) {
            this.bobHead()

            const targetOffset = this.targetHeadBobOffset
            const crouchEaseAmt = 2

            this._headBobOffset += (targetOffset - this.headBobOffset) / this.headBobEaseAmount
            this._crouchedOffset += (this._targetCrouchedOffset - this._crouchedOffset) / crouchEaseAmt

            this.position.y = -3 + this.headBobOffset + this._crouchedOffset
        }

        this.controller.update()
    }

    bobHead() {
        if (this.player.legsState === PlayerLegsState.Crouched) {
            this._targetCrouchedOffset = 3
        } else {
            this._targetCrouchedOffset = 0
        }
        
        const graceSpace = 0.25

        if (this.player.bodyState === PlayerBodyState.Idle) {
            if (Math.abs(this.headBobOffset) > (Math.abs(this.targetHeadBobOffset) - graceSpace)) {
                this.swapHeadBobState()
            }
        }
    }

    swapHeadBobState() {
        let targetBobAmt = this.player.bodyState === PlayerBodyState.Walking ? 1.25 : 1

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

    get headBobOffset() {
        return this._headBobOffset
    }

    get headBobEaseAmount() {
        if (this.player.legsState === PlayerLegsState.Crouched) {
            return 200
        } else if (this.player.bodyState === PlayerBodyState.Walking) {
            return 30
        } else {
            return 50
        }
    }
}
