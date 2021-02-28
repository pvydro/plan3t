import { TweenLite } from 'gsap/all'
import { PlayerWeaponHolster } from '../cliententity/clientplayer/PlayerWeaponHolster'
import { Container } from '../engine/display/Container'
import { Sprite } from '../engine/display/Sprite'
import { Tween } from '../engine/display/tween/Tween'
import { Easing } from '../engine/display/tween/TweenEasing'
import { Flogger } from '../service/Flogger'
import { Defaults } from '../utils/Constants'
import { ProjectileType } from './projectile/Bullet'
import { IWeaponAmmunition, WeaponAmmunition, WeaponAmmunitionOptions } from './WeaponAmmunition'
import { IWeaponEffects, WeaponEffects } from './WeaponEffects'
import { WeaponHelper } from './WeaponHelper'
import { WeaponName } from './WeaponName'

export interface IWeapon extends WeaponStats {
    triggerDown: boolean
    currentTotalBullets: number
    configureByName(name: WeaponName): void
    reset(): void
}

export interface WeaponStats {
    name: string
    damage: number
    fireRate?: number
    weightPounds?: number
    bulletsPerClip?: number
    handleOffsetX?: number
    handleOffsetY?: number
    barrelOffsetY?: number
    handDropAmount?: number
    handPushAmount?: number
    secondHandX?: number
    secondHandY?: number
    recoilX: number
    recoilY: number
}

export interface WeaponOptions {
    name?: WeaponName
    holster?: PlayerWeaponHolster
}

export class Weapon extends Container implements IWeapon {
    playerHolster?: PlayerWeaponHolster

    name: WeaponName
    ammunition: IWeaponAmmunition
    effects: IWeaponEffects
    damage: number
    fireRate?: number
    weightPounds?: number
    handDropAmount?: number = 0
    handPushAmount?: number = 0
    recoilX: number = 0
    recoilY: number = 0
    bulletVelocity: number = Defaults.BulletVelocity

    sprite: Sprite

    triggerDown: boolean = false
    currentShootPromise: Promise<void>
    recoilAnimation?: TweenLite
    recoilXDamping: number = 2
    recoilYDamping: number = 1.1

    fireRateMultiplier: number = 200
    recoilXMultiplier: number = 4
    recoilYMultiplier: number = 0.025
    recoilRandomizer: number = 1
    recoilRandomizerMaximum: number = 1.25
    recoilRandomizerMinimum: number = 0.5

    barrelOffsetY?: number = 5
    offset = { x: 0, y: 0 }
    _currentRecoilOffset = { x: 0, y: 0 }
    _currentRotatedBarrelPoint = { x: 0, y: 0 }

    constructor(options?: WeaponOptions) {
        super()

        this.ammunition = new WeaponAmmunition(this)
        this.effects = new WeaponEffects({ weapon: this })

        if (options) {
            if (options.name) {
                this.name = options.name
    
                this.configureByName(this.name)
            }
            if (options.holster) {
                this.playerHolster = options.holster
            }
        }
    }
    
    update() {
        if (this.triggerDown) {
            this.shoot()
        }

        // Recoil movement
        this._currentRecoilOffset.x += (0 - this._currentRecoilOffset.x) / this.recoilXDamping
        this._currentRecoilOffset.y += (0 - this._currentRecoilOffset.y) / this.recoilYDamping
    }

    async shoot(): Promise<void> {
        if (!this.currentShootPromise) {
            this.currentShootPromise = new Promise((resolve) => {
                if (!this.ammunition.checkAmmunition()) {
                    return
                }

                // Recoil & shoot logic
                this.effects.addMuzzleFlash()
                this.fireBullet()
                this.applyRecoil()
                this.effects.applyScreenEffects()
                this.sendServerShootMessage()

                this.ammunition.release()
    
                // FireRate process
                if (this.fireRate > 0) {
                    setTimeout(() => {
                        resolve()
                    }, (this.fireRate * this.fireRateMultiplier))
                } else {
                    resolve()
                }
            })
            this.currentShootPromise.then(() => {
                this.currentShootPromise = undefined
            })
        }

        return this.currentShootPromise
    }

    fireBullet() {
        Flogger.log('Weapon', 'fireBullet')
        
        const playerHand = this.playerHolster ? this.playerHolster.player.hand : undefined

        if (this.sprite !== undefined
        && playerHand !== undefined) {
            const direction = playerHand.player.direction
            const entityManager = playerHand.player.entityManager
            const bulletX = this._currentRotatedBarrelPoint.x
            const bulletY = this._currentRotatedBarrelPoint.y


            if (entityManager !== undefined) {
                entityManager.createProjectile(ProjectileType.Bullet,
                    bulletX, bulletY, playerHand.rotation, this.bulletVelocity * direction)
            }
        }
    }

    applyRecoil() {
        let int = { interpolation: 0 }
        let recoilOffset: any = { x: 0, y: 0 }
        const recoilX = (this.recoilX * this.recoilXMultiplier) * this.recoilRandomizer
        const recoilY = this.recoilY * this.recoilYMultiplier

        if (this.recoilAnimation) {
            this.recoilAnimation.pause()
        }

        this.recoilRandomizer = Math.random() + this.recoilRandomizerMinimum
        if (this.recoilRandomizer > this.recoilRandomizerMaximum) this.recoilRandomizer = this.recoilRandomizerMaximum
        
        this.recoilAnimation = Tween.to(int, {
            interpolation: 1,
            duration: 0.125,
            ease: Easing.Power4EaseOut,
            onUpdate() {
                recoilOffset.x = -recoilX * int.interpolation
                recoilOffset.y = -recoilY * int.interpolation
            }
        })
        this.recoilAnimation.play()

        this._currentRecoilOffset = recoilOffset
    }

    sendServerShootMessage() {
        Flogger.log('Weapon', 'sendServerShootMessage')

        this.messenger.sendShoot(this)
    }

    configureStats(stats: WeaponStats) {
        this.damage = stats.damage
        this.fireRate = stats.fireRate
        this.weightPounds = stats.weightPounds
        this.handDropAmount = stats.handDropAmount ?? 0
        this.handPushAmount = stats.handPushAmount ?? 0
        this.recoilX = stats.recoilX ?? 0
        this.recoilY = stats.recoilY ?? 0
        this.ammunition.configure(stats as WeaponAmmunitionOptions)
    }

    configureByName(name: WeaponName) {
        this.name = name
        this.clearChildren()

        if (name === null || name === undefined) return

        const baseYOffset = -8
        const texture = WeaponHelper.getWeaponTextureByName(name)
        const stats = WeaponHelper.getWeaponStatsByName(name)

        this.sprite = new Sprite({ texture })
        this.offset.x = stats.handleOffsetX
        this.offset.y = baseYOffset + stats.handleOffsetY
        this.sprite.x = this.offset.x
        this.sprite.y = this.offset.y

        this.addChild(this.sprite)

        this.configureStats(stats)
    }

    reset() {
        this.sprite.x = 0
        this.sprite.y = 0
        this.clearChildren()
        this.configureStats({
            name: '',
            damage: 0,
            handDropAmount: 0,
            handPushAmount: 0,
            recoilX: 0,
            recoilY: 0
        })
    }

    get currentRecoilOffset() {
        return {
            x: this._currentRecoilOffset.x + this.offset.x,
            y: this._currentRecoilOffset.y + this.offset.y
        }
    }

    get messenger() {
        return this.playerHolster.player.messenger
    }
    
    get numberOfClips() {
        return this.ammunition.numberOfClips
    }

    get bulletsPerClip() {
        return this.ammunition.bulletsPerClip
    }

    get currentTotalBullets() {
        return this.ammunition.currentTotalBullets
    }
}
