import { Weapon } from './Weapon'

export interface IWeaponAmmunition {
    numberOfClips: number
    bulletsPerClip: number
    currentTotalBullets: number
    configure(options: WeaponAmmunitionOptions): void
    release(): void
    checkAmmunition(): boolean
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

    checkAmmunition() {
        let hasAmmo: boolean = true

        if (this._currentTotalBullets <= 0) {
            hasAmmo = false
        }

        return hasAmmo
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
