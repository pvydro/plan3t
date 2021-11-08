import { TweenLite } from 'gsap/all'
import { Sounds, SoundUrls } from '../asset/Sounds'
import { PlayerWeaponHolster } from '../cliententity/clientplayer/PlayerWeaponHolster'
import { Container } from '../engine/display/Container'
import { Sprite } from '../engine/display/Sprite'
import { Tween } from '../engine/display/tween/Tween'
import { Easing } from '../engine/display/tween/TweenEasing'
import { IVector2 } from '../engine/math/Vector2'
import { Flogger, log } from '../service/Flogger'
import { Crosshair, CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { ProjectileType } from './projectile/Bullet'
import { IWeaponAmmunition, WeaponAmmunition, WeaponAmmunitionOptions } from './WeaponAmmunition'
import { IWeaponEffects, WeaponEffects } from './WeaponEffects'
import { WeaponHelper } from './WeaponHelper'
import { WeaponName } from './WeaponName'

export interface IWeapon extends WeaponStats {
    triggerDown: boolean
    currentClipBullets: number
    state: WeaponState
    configureByName(name: WeaponName): void
    requestReload(): Promise<void>
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
    reloadTime: number
}

export interface WeaponOptions {
    name?: WeaponName
    holster?: PlayerWeaponHolster
}

export enum WeaponState {
    Loaded = 'Loaded',
    Unloaded = 'Unloaded',
    Reloading = 'Reloading'
}

export class Weapon extends Container implements IWeapon {
    playerHolster?: PlayerWeaponHolster

    name: WeaponName
    state: WeaponState
    ammunition: IWeaponAmmunition
    effects: IWeaponEffects
    damage: number
    fireRate?: number
    weightPounds?: number
    handDropAmount?: number = 0
    handPushAmount?: number = 0
    recoilX: number = 0
    recoilY: number = 0
    reloadTime: number = 0
    bulletVelocity: number = 5

    sprite: Sprite
    unloadedSprite: Sprite

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
        if (this.state === WeaponState.Loaded
        && Crosshair.getInstance().state === CrosshairState.Gameplay
        && !this.currentShootPromise) {
            this.currentShootPromise = new Promise((resolve) => {
                if (!this.ammunition.checkAmmunition()) {
                    return
                }

                // Recoil & shoot logic
                this.effects.addMuzzleFlash()
                // this.fireBullet()
                this.applyRecoil()
                this.shootSound()
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

    shootSound() {
        log('Weapon', 'shootSound')

        Sounds.play(SoundUrls.GunshotA, { volume: 0.125 })
    }

    // fireBullet() {
    //     Flogger.log('Weapon', 'fireBullet')

    //     if (this.state !== WeaponState.Loaded) return
        
    //     const playerHand = this.playerHolster ? this.playerHolster.player.hand : undefined

    //     if (this.sprite !== undefined
    //     && playerHand !== undefined) {
    //         const direction = playerHand.player.direction
    //         const entityManager = playerHand.player.entityManager
    //         const bulletX = this._currentRotatedBarrelPoint.x
    //         const bulletY = this._currentRotatedBarrelPoint.y

    //         if (entityManager !== undefined) {
    //             // entityManager.createProjectile(ProjectileType.Bullet,
    //             //     bulletX, bulletY, playerHand.rotation, this.bulletVelocity * direction)
    //         }
    //     }
    // }

    requestReload() {
        Flogger.log('Weapon', 'requestReload')

        return this.ammunition.requestReload()
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
            // ease: Easing.RoughEase.ThreeCubicOut,
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
        this.state = WeaponState.Loaded
        this.damage = stats.damage
        this.fireRate = stats.fireRate
        this.weightPounds = stats.weightPounds
        this.handDropAmount = stats.handDropAmount ?? 0
        this.handPushAmount = stats.handPushAmount ?? 0
        this.recoilX = stats.recoilX ?? 0
        this.recoilY = stats.recoilY ?? 0
        this.reloadTime = stats.reloadTime
        this.ammunition.configure(stats as WeaponAmmunitionOptions)
    }

    configureByName(name: WeaponName) {
        this.name = name
        this.clearChildren()

        if (name === null || name === undefined) return

        const baseYOffset = -8
        const texture = WeaponHelper.getWeaponTextureByName(name)
        const unloadedTexture = WeaponHelper.getWeaponUnloadedTextureByName(name)
        const stats = WeaponHelper.getWeaponStatsByName(name)

        this.sprite = new Sprite({ texture })
        this.unloadedSprite = new Sprite({ texture: unloadedTexture })
        this.unloadedSprite.alpha = 0
        this.offset.x = stats.handleOffsetX
        this.offset.y = baseYOffset + stats.handleOffsetY

        this.setSpritesPosition(this.offset)
        this.addChild(this.sprite)
        this.addChild(this.unloadedSprite)
        this.configureStats(stats)
    }

    reset() {
        this.clearChildren()
        this.setSpritesPosition({
            x: 0, y: 0
        })
        this.configureStats({
            name: '',
            damage: 0,
            handDropAmount: 0,
            handPushAmount: 0,
            recoilX: 0,
            recoilY: 0,
            reloadTime: 0.5
        })
    }

    setWeaponState(state: WeaponState) {
        if (state === this.state) {
            return
        }

        this.state = state

        switch (state) {
            case WeaponState.Loaded:
                this.showLoadedSprite()
                break
            case WeaponState.Reloading:
            case WeaponState.Unloaded:
                this.showUnloadedSprite()
                break
        }
    }

    setSpritesPosition(newPosition: IVector2) {
        for (var i in this.sprites) {
            const spr = this.sprites[i]

            spr.x = newPosition.x
            spr.y = newPosition.y
        }
    }

    showLoadedSprite() {
        this.sprite.alpha = 1
        this.unloadedSprite.alpha = 0
    }

    showUnloadedSprite() {
        this.sprite.alpha = 0
        this.unloadedSprite.alpha = 1
    }

    get sprites() {
        return [
            this.sprite, this.unloadedSprite
        ]
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

    get currentClipBullets() {
        return this.ammunition.currentClipBullets
    }
}
