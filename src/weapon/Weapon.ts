import * as PIXI from 'pixi.js'
import { Container } from '../display/Container'
import { WeaponName } from './WeaponName'

export interface IWeapon extends IWeaponStats {
    configureForName(name: WeaponName): void
}

export interface IWeaponStats {
    damage: number
    fireRate?: number
    weightPounds?: number
    bulletsPerClip?: number
}

export class Weapon extends Container implements IWeapon {
    name: WeaponName
    damage: number
    fireRate?: number
    weightPounds?: number
    bulletsPerClip?: number
    numberOfClips?: number

    constructor(name: WeaponName) {
        super()

        this.name = name

        this.configureForName(this.name)
    }

    configure(model: IWeapon) {
        this.clearChildren()
    }

    configureForName(name: WeaponName) {

    }
}
