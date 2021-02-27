import { Weapon } from "./Weapon";

export interface IWeaponAmmunition {

}

export interface WeaponAmmunitionOptions {
    numberOfClips?: number
    bulletsPerClip?: number
}

export class WeaponAmmunition implements IWeaponAmmunition {
    _numberOfClips: number
    _bulletsPerClip: number
    weapon: Weapon

    constructor(weapon: Weapon) {
        this.weapon = weapon
    }

    configure(options: WeaponAmmunitionOptions) {
        this._numberOfClips = options.numberOfClips ?? 1
        this._bulletsPerClip = options.bulletsPerClip ?? 1
    }
    
    get numberOfClips() {
        return this._numberOfClips
    }

    get bulletsPerClip() {
        return this._bulletsPerClip
    }
}
