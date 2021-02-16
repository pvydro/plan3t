import gsap from 'gsap/all'
import { TweenLite } from 'gsap/all'
import { Camera } from '../camera/Camera'
import { PlayerHand } from '../cliententity/clientplayer/PlayerHand'
import { PlayerWeaponHolster } from '../cliententity/clientplayer/PlayerWeaponHolster'
import { Container } from '../engine/display/Container'
import { MuzzleFlashParticle } from '../engine/display/particle/MuzzleFlashParticle'
import { Sprite } from '../engine/display/Sprite'
import { Tween } from '../engine/display/tween/Tween'
import { Easing } from '../engine/display/tween/TweenEasing'
import { Direction } from '../engine/math/Direction'
import { Vector2 } from '../engine/math/Vector2'
import { InputProcessor } from '../input/InputProcessor'
import { ParticleManager } from '../manager/ParticleManager'
import { Flogger } from '../service/Flogger'
import { Defaults, GlobalScale } from '../utils/Constants'
import { ProjectileType } from './projectile/Bullet'
import { WeaponHelper } from './WeaponHelper'
import { WeaponName } from './WeaponName'

export interface IWeapon extends WeaponStats {
    triggerDown: boolean
    configureByName(name: WeaponName): void
    reset(): void
}

export interface WeaponStats {
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
    damage: number
    fireRate?: number
    weightPounds?: number
    bulletsPerClip?: number
    numberOfClips?: number
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
        if (this.currentShootPromise) {
            return this.currentShootPromise
        } else {
            this.currentShootPromise = new Promise((resolve) => {
                // Recoil & shoot logic
                this.addMuzzleFlash()
                this.fireBullet()
                this.applyRecoil()
                this.applyScreenEffects()
    
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

    applyScreenEffects() {
        const camera = Camera.getInstance()

        camera.shake(1)
        camera.flash({
            minimumBrightness: 0.15,
            maximumBrightness: 0.3
        })
    }

    addMuzzleFlash() {
        const player = this.playerHolster ? this.playerHolster.player : undefined
        const playerHand = player ? player.hand : undefined
        const handRotation = playerHand ? playerHand.rotation : undefined
        let rotation = handRotation ? handRotation : this.rotation

        if (player && this.sprite) {
            rotation *= player.direction

            const referenceX = player.x + this.x
            const referenceY = player.y + (this.y * GlobalScale)
            const handRotationX = playerHand ? playerHand.rotationContainer.x : 0
            const halfWidth = (this.sprite.halfWidth * GlobalScale) + (handRotationX * GlobalScale)
            const halfHeight = (-this.sprite.halfHeight * GlobalScale)
                + (this.barrelOffsetY * GlobalScale)

            const handSpriteX = playerHand.handSprite.x * GlobalScale
            const handX = handSpriteX * player.direction

            let distanceX = (halfWidth * Math.cos(rotation)) - (halfHeight * Math.sin(rotation))
            let distanceY = (halfWidth * Math.sin(rotation)) + (halfHeight * Math.cos(rotation))
            let translatedX = referenceX + (distanceX * player.direction) + handX
            let translatedY = referenceY + (distanceY * 1.1)
            translatedX += (this.handPushAmount * GlobalScale) * player.direction
            translatedY += (this.handDropAmount * GlobalScale)
            
            this._currentRotatedBarrelPoint = {
                x: translatedX, y: translatedY
            }
            
            const particle = new MuzzleFlashParticle({
                position: new Vector2(translatedX, translatedY),
                rotation: rotation * player.direction
            })

            if (player.direction === Direction.Left) {
                particle.scale.x = (particle.scale.x * -1)
            }

            ParticleManager.getInstance().addParticle(particle)
        }
    }

    configureStats(stats: WeaponStats) {
        this.damage = stats.damage
        this.fireRate = stats.fireRate
        this.weightPounds = stats.weightPounds
        this.bulletsPerClip = stats.bulletsPerClip
        this.numberOfClips = 3
        this.handDropAmount = stats.handDropAmount ?? 0
        this.handPushAmount = stats.handPushAmount ?? 0
        this.recoilX = stats.recoilX ?? 0
        this.recoilY = stats.recoilY ?? 0
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
        this.sprite.x = this.offset.x// + this._currentRecoilOffset.x
        this.sprite.y = this.offset.y// + this._currentRecoilOffset.y

        this.addChild(this.sprite)

        this.configureStats(stats)
    }

    reset() {
        this.sprite.x = 0
        this.sprite.y = 0
        this.clearChildren()
        this.configureStats({
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
}
