import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../engine/math/Direction'
import { Flogger } from '../../service/Flogger'
import { Weapon } from '../../weapon/Weapon'
import { WeaponHelper } from '../../weapon/WeaponHelper'
import { WeaponName } from '../../weapon/WeaponName'
import { ClientPlayer } from './ClientPlayer'
import { IPlayerHandController, PlayerHandController } from './PlayerHandController'

export interface IPlayerHand extends IUpdatable {
    setWeapon(name: WeaponName): void
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
    primaryWeapon: Weapon
    

    constructor(options: PlayerHandOptions) {
        super()
        this._player = options.player
        this.controller = new PlayerHandController({ playerHand: this })
        
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HAND_HUMAN_DEFAULT))
        this.handSprite = new Sprite({ texture })
        this.secondHandSprite = new Sprite({ texture })
        this.handSprite.anchor.set(0.5, 0.5)
        this.secondHandSprite.anchor.set(0.5, 0.5)
        this.secondHandSprite.alpha = 0
        
        this.primaryWeapon = new Weapon()
        
        this.rotationContainer = new Container()

        this.rotationContainer.addChild(this.secondHandSprite)
        this.rotationContainer.addChild(this.primaryWeapon)
        this.rotationContainer.addChild(this.handSprite)

        this.addChild(this.rotationContainer)
        this.rotationContainer.x = 4
    }

    update() {
        const halfACircleInRadians = 3.14159
        const handPushAmount = this.primaryWeapon && this.primaryWeapon.handPushAmount ? this.primaryWeapon.handPushAmount : 0
        const handDropAmount = this.primaryWeapon && this.primaryWeapon.handDropAmount ? this.primaryWeapon.handDropAmount : 0

        const direction = this._player.direction
        const bobOffsetY = this._player.head.headBobOffset / 1.5
        let newOffsetX = direction === Direction.Right
            ? -this.baseOffsetX + handPushAmount
            : this.baseOffsetX - handPushAmount
        let newOffsetY = this.baseOffsetY + handDropAmount + bobOffsetY
        
        this.currentOffsetY += (newOffsetY - this.currentOffsetY) / this.handOffsetDamping
        this.currentOffsetX += (newOffsetX - this.currentOffsetX) / this.handOffsetDamping

        this.x = this.currentOffsetX
        this.y = this.currentOffsetY

        this.controller.update(this.player.isClientControl)

        this.secondHandSprite.rotation = direction === Direction.Right
            ? -this.rotation + (this.rotation / 2)
            : this.rotation - halfACircleInRadians - (this.rotation / 2)
            
    }

    setWeapon(name: WeaponName) {
        this.primaryWeapon.configureByName(name)

        const stats = WeaponHelper.getWeaponStatsByName(name)

        if (stats.secondHandX !== undefined || stats.secondHandY !== undefined) {
            this.showSecondHand(true, stats.secondHandX, stats.secondHandY)
        } else {
            this.showSecondHand(false)
        }
    }

    showSecondHand(shouldShow: boolean, handX?: number, handY?: number) {
        Flogger.log('PlayerHand', 'showSecondHand', 'shouldShow', shouldShow, 'handX', handX, 'handY', handY)
        if (shouldShow === true) {
            this.secondHandSprite.alpha = 1
        } else {
            this.secondHandSprite.alpha = 0
        }

        if (handX) {
            this.secondHandSprite.x = handX ? handX : 2
            this.secondHandSprite.y = handY ? handY : 0
        }
    }
    
    empty() {
        this.primaryWeapon.clearChildren()
        this.primaryWeapon.reset()
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

    get player() {
        return this._player
    }
}
