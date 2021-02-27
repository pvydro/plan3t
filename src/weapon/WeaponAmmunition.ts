import { Weapon } from "./Weapon";

export interface IWeaponAmmunition {
    numberOfClips: number
    bulletsPerClip: number
    currentTotalBullets: number
    release(): void
}

export interface WeaponAmmunitionOptions {
    numberOfClips?: number
    bulletsPerClip?: number
}

export class WeaponAmmunition implements IWeaponAmmunition {
    _numberOfClips: number
    _bulletsPerClip: number
    _currentTotalBullets: number
    weapon: Weapon

    constructor(weapon: Weapon) {
        this.weapon = weapon
    }

    configure(options: WeaponAmmunitionOptions) {
        this._numberOfClips = options.numberOfClips ?? 1
        this._bulletsPerClip = options.bulletsPerClip ?? 1
        this._currentTotalBullets = this._bulletsPerClip
    }

    release() {
        this._currentTotalBullets--
    }
    
    get numberOfClips() {
        return this._numberOfClips
    }

    get bulletsPerClip() {
        return this._bulletsPerClip
    }

    get currentTotalBullets() {
        return this._currentTotalBullets
    }
}
