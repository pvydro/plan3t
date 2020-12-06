import { Container } from '../display/Container'
import { Sprite } from '../display/Sprite'
import { WeaponHelper } from './WeaponHelper'
import { WeaponName } from './WeaponName'

export interface IWeapon extends WeaponStats {
    configureByName(name: WeaponName): void
}

export interface WeaponStats {
    damage: number
    fireRate?: number
    weightPounds?: number
    bulletsPerClip?: number
    handleOffsetX?: number
}

export class Weapon extends Container implements IWeapon {
    name: WeaponName
    damage: number
    fireRate?: number
    weightPounds?: number
    bulletsPerClip?: number
    numberOfClips?: number
    handleOffsetX?: number

    sprite: Sprite

    constructor(name?: WeaponName) {
        super()

        if (this.name) {
            this.name = name

            this.configureByName(this.name)
        }

    }

    configureStats(stats: WeaponStats) {
    }

    configureByName(name: WeaponName) {
        this.clearChildren()

        const baseYOffset = -8
        const texture = WeaponHelper.getWeaponTextureByName(name)
        const stats = WeaponHelper.getWeaponStatsByName(name)

        this.sprite = new Sprite({ texture })
        this.sprite.x += stats.handleOffsetX
        this.sprite.y += baseYOffset 

        this.addChild(this.sprite)

        this.configureStats(stats)
    }
}
