import { Flogger } from '../service/Flogger'
import { Weapon, WeaponState } from './Weapon'

export interface IWeaponAmmunition {
    numberOfClips: number
    bulletsPerClip: number
    currentClipBullets: number
    configure(options: WeaponAmmunitionOptions): void
    release(): void
    checkAmmunition(): boolean
    requestReload(): Promise<void>
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
    currentReloadPromise: Promise<void>

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

    requestReload() {
        if (this.currentReloadPromise !== undefined) {
            return this.currentReloadPromise
        }

        if (this.currentClipBullets === this.bulletsPerClip
        || this.weapon.state === WeaponState.Reloading) {
            return
        }
        
        this.currentReloadPromise = new Promise((resolve) => {
            Flogger.log('WeaponAmmunition', 'Begin reload', 'reloadTime', this.weapon.reloadTime)

            const calculatedReloadTime = 1000 * this.weapon.reloadTime

            this.weapon.setWeaponState(WeaponState.Reloading)

            window.setTimeout(() => {
                Flogger.log('WeaponAmmunition', 'Reload complete')

                this.currentReloadPromise = undefined
                this.insertClip()

                resolve()
            }, calculatedReloadTime)
        })

        return this.currentReloadPromise
    }

    insertClip() {
        this._currentClipBullets = this.bulletsPerClip
        this.weapon.setWeaponState(WeaponState.Loaded)
        this.weapon.currentShootPromise = undefined
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
