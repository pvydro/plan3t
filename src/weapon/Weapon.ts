import gsap from 'gsap/all'
import { TweenLite } from 'gsap/all'
import { Container } from '../engine/display/Container'
import { Sprite } from '../engine/display/Sprite'
import { Flogger } from '../service/Flogger'
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
    handDropAmount?: number
    handPushAmount?: number
    secondHandX?: number
    secondHandY?: number
    recoilX: number
    recoilY: number
}

export class Weapon extends Container implements IWeapon {
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

    sprite: Sprite

    triggerDown: boolean = false
    currentShootPromise: Promise<void>
    recoilAnimation?: TweenLite
    recoilDamping: number = 2

    fireRateMultiplier: number = 200
    recoilXMultiplier: number = 4

    offset = { x: 0, y: 0 }
    _currentRecoilOffset = { x: 0, y: 0 }

    constructor(name?: WeaponName) {
        super()

        if (this.name) {
            this.name = name

            this.configureByName(this.name)
        }
    }

    update() {
        // const recoilOffsetMultiplier = this.direction === Direction.Left ? 1 : -1
        
        if (this.triggerDown) {
            this.shoot()
        }

        // Recoil movement
        this._currentRecoilOffset.x += (0 - this._currentRecoilOffset.x) / this.recoilDamping
        this._currentRecoilOffset.y += (0 - this._currentRecoilOffset.y) / this.recoilDamping

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
                this.fireBullet()
    
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

        this.applyRecoil()
    }

    applyRecoil() {
        let int = { interpolation: 0 }
        let recoilOffset: any = { x: 0, y: 0 }
        const recoilX = this.recoilX * this.recoilXMultiplier
        const recoilY = this.recoilY * 0

        if (this.recoilAnimation) {
            this.recoilAnimation.pause()
        }
        
        this.recoilAnimation = gsap.to(int, { interpolation: 1, duration: 0.125, ease: 'power4', onUpdate() {
            console.log(int.interpolation)
            recoilOffset.x = -recoilX * int.interpolation
            recoilOffset.y = -recoilY * int.interpolation
        }})
        this._currentRecoilOffset = recoilOffset
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
