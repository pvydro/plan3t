import * as PIXI from 'pixi.js'
import { Power4 } from 'gsap'
import { Container, IContainer } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { ClientPlayer } from '../ClientPlayer'
import { IUpdatable } from '../../../interface/IUpdatable'
import { Direction } from '../../../engine/math/Direction'
import { IPlayerHeadController, PlayerHeadController } from './PlayerHeadController'
import { Tween } from '../../../engine/display/tween/Tween'
import { PlayerBodyState, PlayerConsciousnessState, PlayerLegsState  } from '../ClientPlayerState'
import { IPlayerHair, PlayerHair } from '../customization/PlayerHair'

export interface IPlayerHead extends IContainer, IUpdatable {
    headBobOffset: number
    headBobOffsetInterpoliation: { interpolation: number }
    setCustomHeadSprite(assetUrl: string): void
    setHair(hair: PlayerHair): void
}

export interface PlayerHeadOptions {
    player: ClientPlayer
}

export class PlayerHead extends Container {
    _targetCrouchedOffset = 0
    _crouchedOffset = 0
    player: ClientPlayer
    controller: IPlayerHeadController
    headSprite: Sprite
    currentHair: IPlayerHair
    currentDirection: Direction = Direction.Right
    headBobOffsetInterpoliation: { interpolation: number } = { interpolation: 0 }
    headBobOffset: number = 0
    targetHeadBobOffset: number = 0
    headBobState: string = 'notset'//'up'
    headBobEase: gsap.EaseFunction = Power4.easeOut
    // RoughEase.ease.config({
    //     template: Power0.easeOut,
    //     strength: 0.4,
    //     points: 7,
    //     taper: 'none',
    //     randomize: false,
    //     clamp: true
    // })

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
        // this.player.emitter.on(PlayerEvents.PlayerWalkBounce, () => {
        //     this.swapHeadBobState()
        // })
    }

    update() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Alive) {
            this.bobHead()
            const crouchEaseAmt = 2
            
            this.headBobOffset = Math.floor(this.headBobOffsetInterpoliation.interpolation)
            this._crouchedOffset += (this._targetCrouchedOffset - this._crouchedOffset) / crouchEaseAmt
            this.position.y = -3 + this.headBobOffset + this._crouchedOffset
        }

        // if (!this.player.frozen) {
            this.controller.update()
            if (this.currentHair) this.currentHair.update()
        // }
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
        const targetBobAmt = 1

        // Toggle head bob state
        this.headBobState = this.headBobState === 'up' ? 'down' : 'up'
        this.targetHeadBobOffset = this.headBobState === 'up' ? -targetBobAmt : targetBobAmt

        Tween.to(this.headBobOffsetInterpoliation, {
            duration: isWalking ? 2.05 : 2.25,//1.05 : 1.25,
            ease: this.headBobEase,
            interpolation: this.targetHeadBobOffset,
            autoplay: true,
            onComplete: () => {
                this.swapHeadBobState()
            }
        })
    }

    setCustomHeadSprite(assetUrl: string) {
        // this.customSpriteContainer
    }

    setHair(hair: PlayerHair) {
        this.currentHair = hair
        this.currentHair.setHead(this)
        
        this.addChild(hair)
    }
    
    flipAllSprites() {
        this.headSprite.flipX()
        if (this.currentHair) this.currentHair.flipX()
    }

    set direction(value: Direction) {
        if (this.currentDirection !== value) {
            this.currentDirection = value
            this.flipAllSprites()
        }
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
