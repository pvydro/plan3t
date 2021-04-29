import * as PIXI from 'pixi.js'
import { Power0 } from 'gsap'
import { RoughEase } from 'gsap/EasePack'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Assets, AssetUrls } from '../../asset/Assets'
import { ClientPlayer, PlayerBodyState, PlayerConsciousnessState, PlayerLegsState } from './ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../engine/math/Direction'
import { IPlayerHeadController, PlayerHeadController } from './PlayerHeadController'
import { PlayerEvents } from '../../model/events/Events'
import { Tween } from '../../engine/display/tween/Tween'
import { Easing } from '../../engine/display/tween/TweenEasing'

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

    _targetCrouchedOffset = 0
    _crouchedOffset = 0
    headBobOffset = 0
    targetHeadBobOffset = 0
    headBobState = 'notset'//'up'

    constructor(options: PlayerHeadOptions) {
        super()
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PlayerHeadHumanDefault))

        this.player = options.player
        this.controller = new PlayerHeadController({
            playerHead: this,
            player: this.player
        })
        this.headSprite = new Sprite({ texture })
        this.headSprite.anchor.set(0.475, 0.9)

        this.addChild(this.headSprite)

        // Bob head when walking
        this.player.emitter.on(PlayerEvents.PlayerWalkBounce, () => {
            this.swapHeadBobState()
        })
    }

    update() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Alive) {
            this.bobHead()
            const crouchEaseAmt = 2
            
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
        
        if (this.headBobState === 'notset') {
            this.swapHeadBobState()
        }
    }

    swapHeadBobState() {
        const isWalking = (this.player.bodyState === PlayerBodyState.Walking
            || this.player.bodyState === PlayerBodyState.Sprinting)
        const targetBobAmt = isWalking ? 1.75 : 1.5
        const ease = RoughEase.ease.config({
            template: Power0.easeOut,
            strength: 0.4,
            points: 8,
            taper: 'none',
            randomize: false,
            clamp: true
        })

        // Toggle head bob state
        this.headBobState = this.headBobState === 'up' ? 'down' : 'up'
        this.targetHeadBobOffset = this.headBobState === 'up' ? -targetBobAmt : targetBobAmt

        Tween.to(this, {
            duration: isWalking ? 0.85 : 1,
            ease,
            headBobOffset: this.targetHeadBobOffset,
            autoplay: true,
            onComplete: () => {
                this.swapHeadBobState()
            }
        })
    }

    set direction(value: Direction) {
        if (this.currentDirection !== value) {
            this.flipAllSprites()
        }
        this.currentDirection = value
    }

    flipAllSprites() {
        this.scale.x *= -1
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
