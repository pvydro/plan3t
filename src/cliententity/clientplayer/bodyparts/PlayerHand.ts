import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Container } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { IUpdatable } from '../../../interface/IUpdatable'
import { Direction } from '../../../engine/math/Direction'
import { log } from '../../../service/Flogger'
import { Weapon, WeaponState } from '../../../weapon/Weapon'
import { WeaponHelper } from '../../../weapon/WeaponHelper'
import { ClientPlayer } from '../ClientPlayer'
import { IPlayerHandController, PlayerHandController } from './PlayerHandController'
import { IShowHide } from '../../../interface/IShowHide'
import { inGameHUD } from '../../../shared/Dependencies'

export interface IPlayerHand extends IUpdatable, IShowHide {
    setWeapon(weapon: Weapon): void
    setTargetRotation(targetRotation: number): void
    empty(): void
}

export interface PlayerHandOptions {
    player: ClientPlayer
}

export class PlayerHand extends Container implements IPlayerHand {
    _player: ClientPlayer
    rotationContainer: Container
    handOffsetDamping = 5
    controller: IPlayerHandController
    currentDirection: Direction = Direction.Right
    baseOffsetX: number = 2
    baseOffsetY: number = 3
    currentOffsetX: number = this.baseOffsetX
    currentOffsetY: number = this.baseOffsetY

    handSprite: Sprite
    secondHandSprite: Sprite
    secondHandShown: boolean = false
    equippedWeapon?: Weapon

    recoilOffsetDivisor: number = 3

    constructor(options: PlayerHandOptions) {
        super()
        this._player = options.player
        this.controller = new PlayerHandController({ playerHand: this })
        
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PlayerHandHumanDefault))
        this.handSprite = new Sprite({ texture })
        this.secondHandSprite = new Sprite({ texture })
        this.handSprite.anchor.set(0.5, 0.5)
        this.secondHandSprite.anchor.set(0.5, 0.5)
        this.secondHandSprite.alpha = 0

        this.rotationContainer = new Container()

        this.rotationContainer.addChild(this.secondHandSprite)
        this.rotationContainer.addChild(this.handSprite)

        this.addChild(this.rotationContainer)
        this.rotationContainer.x = 4
    }

    update() {
        const halfACircleInRadians = 3.14159
        const handPushAmount = this.equippedWeapon && this.equippedWeapon.handPushAmount ? this.equippedWeapon.handPushAmount : 0
        const handDropAmount = this.equippedWeapon && this.equippedWeapon.handDropAmount ? this.equippedWeapon.handDropAmount : 0
        const direction = this._player.direction
        const bobOffsetY = this._player.head.headBobOffsetInterpoliation.interpolation / 2.5
        let newOffsetX = direction === Direction.Right
            ? -this.baseOffsetX + handPushAmount
            : this.baseOffsetX - handPushAmount
        let newOffsetY = this.baseOffsetY + handDropAmount + bobOffsetY
        
        this.currentOffsetY += (newOffsetY - this.currentOffsetY) / this.handOffsetDamping
        this.currentOffsetX += (newOffsetX - this.currentOffsetX) / this.handOffsetDamping

        const recoilOffsetX = (this.equippedWeapon && this.equippedWeapon._currentRecoilOffset)
            ? this.equippedWeapon._currentRecoilOffset.x : 0
        const recoilOffsetY = (this.equippedWeapon && this.equippedWeapon._currentRecoilOffset)
            ? this.equippedWeapon._currentRecoilOffset.y : 0
        this.x = this.currentOffsetX + (recoilOffsetX * this.player.direction)
        this.y = this.currentOffsetY + (recoilOffsetY * this.player.direction)

        this.handSprite.x = (recoilOffsetX / this.recoilOffsetDivisor) * this.player.direction

        this.controller.update(this.player.isClientPlayer)

        this.secondHandSprite.rotation = direction === Direction.Right
            ? -this.rotation + (this.rotation / 2)
            : this.rotation - halfACircleInRadians - (this.rotation / 2)
        
        if (this.player.isClientPlayer) {
            inGameHUD.crosshair.setTargetRotation(this.rotation)
        }

        if (this.equippedWeapon) this.equippedWeapon.update()
    }

    setWeapon(weapon: Weapon) {
        if (this.equippedWeapon) this.empty()

        this.equippedWeapon = weapon

        if (!this.equippedWeapon) return
        
        const stats = WeaponHelper.getWeaponStatsByName(weapon.name)

        this.rotationContainer.addChildAt(this.equippedWeapon, 0)

        if (stats.secondHandX !== undefined || stats.secondHandY !== undefined) {
            this.showSecondHand(true, stats.secondHandX, stats.secondHandY)
        } else {
            this.showSecondHand(false)
        }
    }

    showSecondHand(shouldShow: boolean, handX?: number, handY?: number) {
        log('PlayerHand', 'showSecondHand', 'shouldShow', shouldShow, 'handX', handX, 'handY', handY)

        if (this.secondHandShown === shouldShow) return
        this.secondHandShown = shouldShow

        if (shouldShow) {
            this.secondHandSprite.alpha = 1
        } else {
            this.secondHandSprite.alpha = 0
        }

        if (handX) {
            this.secondHandSprite.x = handX ? handX : 2
            this.secondHandSprite.y = handY ? handY : 0
        }
    }

    async show() {
        this.handSprite.alpha = 1
        if (this.equippedWeapon && this.equippedWeapon.stats.secondHandX) {
            this.showSecondHand(true)
        }
    }

    async hide() {
        this.handSprite.alpha = 0
        this.showSecondHand(false)
    }

    empty() {
        this.rotationContainer.removeChild(this.equippedWeapon)
    }

    setTargetRotation(targetRotation: number) {
        this.rotation = targetRotation
    }

    flipAllSprites() {
        this.scale.x *= -1
    }

    set direction(value: Direction) {
        if (this.currentDirection !== value) {
            this.flipAllSprites()
        }

        this.currentDirection = value
    }

    get player() {
        return this._player
    }
}
