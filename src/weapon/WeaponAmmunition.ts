import { Weapon, WeaponState } from './Weapon'

export interface IWeaponAmmunition {
    numberOfClips: number
    bulletsPerClip: number
    currentClipBullets: number
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
    _currentClipBullets: number
    weapon: Weapon

    constructor(weapon: Weapon) {
        this.weapon = weapon
    }

    configure(options: WeaponAmmunitionOptions) {
        this._numberOfClips = options.numberOfClips ?? 1
        this._bulletsPerClip = options.bulletsPerClip ?? 1
        this._currentClipBullets = this._bulletsPerClip
    }

    release() {
        this._currentClipBullets--
    }

    checkAmmunition() {
        let hasAmmo: boolean = true

        if (this._currentClipBullets <= 0) {
            hasAmmo = false
            this.weapon.setWeaponState(WeaponState.Unloaded)
        }

        return hasAmmo
    }
    
    get numberOfClips() {
        return this._numberOfClips
    }

    get bulletsPerClip() {
        return this._bulletsPerClip
    }

    get currentClipBullets() {
        return this._currentClipBullets
    }
}
