import { Container } from '../display/Container'
import { Sprite } from '../display/Sprite'
import { WeaponHelper } from './WeaponHelper'
import { WeaponName } from './WeaponName'

export interface IWeapon extends WeaponStats {
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

    sprite: Sprite

    constructor(name?: WeaponName) {
        super()

        if (this.name) {
            this.name = name

            this.configureByName(this.name)
        }

    }

    configureStats(stats: WeaponStats) {
        this.damage = stats.damage
        this.fireRate = stats.fireRate
        this.weightPounds = stats.weightPounds
        this.bulletsPerClip = stats.bulletsPerClip
        this.numberOfClips = 3
        this.handDropAmount = stats.handDropAmount ? stats.handDropAmount : 0
        this.handPushAmount = stats.handPushAmount ? stats.handPushAmount : 0
    }

    configureByName(name: WeaponName) {
        this.name = name
        this.clearChildren()

        const baseYOffset = -8
        const texture = WeaponHelper.getWeaponTextureByName(name)
        const stats = WeaponHelper.getWeaponStatsByName(name)

        this.sprite = new Sprite({ texture })
        this.sprite.x += stats.handleOffsetX
        this.sprite.y += baseYOffset + stats.handleOffsetY

        this.addChild(this.sprite)

        this.configureStats(stats)
    }

    reset() {
        this.clearChildren()
        this.configureStats({
            damage: 0,
            handDropAmount: 0,
            handPushAmount: 0
        })
    }
}
