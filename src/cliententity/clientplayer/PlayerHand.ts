import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../display/Container'
import { Sprite } from '../../display/Sprite'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'
import { Weapon } from '../../weapon/Weapon'
import { WeaponName } from '../../weapon/WeaponName'
import { ClientPlayer } from './ClientPlayer'
import { IPlayerHandController, PlayerHandController } from './PlayerHandController'

export interface IPlayerHand extends IUpdatable {

}

export interface PlayerHandOptions {
    player: ClientPlayer
}

export class PlayerHand extends Container implements IPlayerHand {
    _player: ClientPlayer
    handOffsetDamping = 10
    controller: IPlayerHandController
    currentDirection: Direction = Direction.Right
    baseOffsetX: number = 2
    baseOffsetY: number = 3
    currentOffsetX: number = this.baseOffsetX
    currentOffsetY: number = this.baseOffsetY

    handSprite: Sprite

    primaryWeapon: Weapon
    
    constructor(options: PlayerHandOptions) {
        super()
        this._player = options.player
        this.controller = new PlayerHandController({ playerHand: this })
        
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HAND_HUMAN_DEFAULT))
        this.handSprite = new Sprite({ texture })
        this.handSprite.anchor.set(0.5, 0.5)
        
        this.primaryWeapon = new Weapon()
        
        this.addChild(this.primaryWeapon)
        this.addChild(this.handSprite)
    }

    update() {
        const direction = this._player.direction
        let newOffsetX = direction === Direction.Right
            ? -this.baseOffsetX + this.primaryWeapon.handPushAmount
            : this.baseOffsetX - this.primaryWeapon.handPushAmount
        let newOffsetY = this.baseOffsetY + this.primaryWeapon.handDropAmount
        
        this.currentOffsetY += (newOffsetY - this.currentOffsetY) / this.handOffsetDamping
        this.currentOffsetX += (newOffsetX - this.currentOffsetX) / this.handOffsetDamping

        this.x = this.currentOffsetX
        this.y = this.currentOffsetY

        this.controller.update(this.player.isClientControl)
    }

    setWeapon(name: WeaponName) {
        this.primaryWeapon.configureByName(name)
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
