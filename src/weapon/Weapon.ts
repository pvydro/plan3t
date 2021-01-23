import gsap from 'gsap/all'
import { TweenLite } from 'gsap/all'
import { Camera } from '../camera/Camera'
import { PlayerHand } from '../cliententity/clientplayer/PlayerHand'
import { Container } from '../engine/display/Container'
import { MuzzleFlashParticle } from '../engine/display/particle/MuzzleFlashParticle'
import { Sprite } from '../engine/display/Sprite'
import { Direction } from '../engine/math/Direction'
import { Vector2 } from '../engine/math/Vector2'
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

export class Weapon extends Container implements IWeapon {
    playerHand?: PlayerHand

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

    constructor(name?: WeaponName, hand?: PlayerHand) {
        super()

        if (name) {
            this.name = name

            this.configureByName(this.name)
        }
        if (hand) {
            this.playerHand = hand
        }
    }

    update() {
        // const recoilOffsetMultiplier = this.direction === Direction.Left ? 1 : -1
        
        if (this.triggerDown) {
            this.shoot()
        }

        // Recoil movement
        this._currentRecoilOffset.x += (0 - this._currentRecoilOffset.x) / this.recoilXDamping
        this._currentRecoilOffset.y += (0 - this._currentRecoilOffset.y) / this.recoilYDamping

        // if (this.sprite) {
        //     this.sprite.x = this.offset.x + this._currentRecoilOffset.x
        //     this.sprite.y = this.offset.y + this._currentRecoilOffset.y
        // }
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
        if (this.playerHand !== undefined
        && this.playerHand.player !== undefined) {
            const direction = this.playerHand.player.direction
            const entityManager = this.playerHand.player.entityManager
            // const crouchOffset = this.playerHand.currentOffsetY
            const bulletX = this._currentRotatedBarrelPoint.x
            const bulletY = this._currentRotatedBarrelPoint.y


            if (entityManager !== undefined) {
                entityManager.createProjectile(ProjectileType.Bullet,
                    bulletX, bulletY, this.playerHand.rotation, this.bulletVelocity * direction)
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
        
        this.recoilAnimation = gsap.to(int, { interpolation: 1, duration: 0.125, ease: 'power4', onUpdate() {
            recoilOffset.x = -recoilX * int.interpolation
            recoilOffset.y = -recoilY * int.interpolation
        }})
        this._currentRecoilOffset = recoilOffset
    }

    addMuzzleFlash() {
        let rotation = this.playerHand ? this.playerHand.rotation : this.rotation
        const player = this.playerHand.player

        if (player) {
            rotation *= player.direction

            const referenceX = player.x + this.x
            const referenceY = player.y + (this.y * GlobalScale)

            const halfWidth = (this.sprite.halfWidth * GlobalScale) + ((this.playerHand.rotationContainer.x) * GlobalScale)
            const halfHeight = (-this.sprite.halfHeight * GlobalScale)
                + (this.barrelOffsetY * GlobalScale)

            const handX = (this.playerHand.handSprite.x * GlobalScale) * player.direction

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
