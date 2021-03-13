import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { Flogger } from '../../service/Flogger'
import { InGameHUD } from '../../ui/ingamehud/InGameHUD'
import { Emitter } from '../../utils/Emitter'
import { IWeapon, Weapon } from '../../weapon/Weapon'
import { WeaponName } from '../../weapon/WeaponName'
import { ClientPlayer, PlayerConsciousnessState } from './ClientPlayer'
import { IPlayerMessenger } from './PlayerMessenger'

export enum CurrentWeaponStatus {
    Primary, Secondary, None
}

export interface WeaponHolsterLoadout {
    primaryWeaponName?: WeaponName
    secondaryWeaponName?: WeaponName
}

export interface IPlayerWeaponHolster {
    swapWeapon(): void
    setWeaponStatus(status: CurrentWeaponStatus)
    setCurrentWeapon(name: WeaponName): void
    setSecondaryWeapon(name: WeaponName): void
}

export interface PlayerWeaponHolsterOptions {
    player: ClientPlayer
}

export class PlayerWeaponHolster implements IPlayerWeaponHolster {
    player: ClientPlayer
    messenger: IPlayerMessenger
    currentLoadout: WeaponHolsterLoadout
    primaryWeapon: Weapon = new Weapon({ holster: this })
    secondaryWeapon: Weapon = new Weapon({ holster: this })
    currentWeapon?: IWeapon
    handsWeapon?: IWeapon
    currentWeaponStatus?: CurrentWeaponStatus = CurrentWeaponStatus.None

    constructor(options: PlayerWeaponHolsterOptions) {
        this.player = options.player
        this.messenger = this.player.messenger

        if (this.player.isClientPlayer) {
            this.applyListeners()
        }
    }

    applyListeners() {
        InputProcessor.on(InputEvents.MouseDown, () => { this.mouseDown() })
        InputProcessor.on(InputEvents.MouseUp, () => { this.mouseUp() })
        InputProcessor.on(InputEvents.KeyDown, (e: KeyboardEvent) => {
            switch (e.which) {
                case Key.Q:
                    this.swapWeapon()
                    break
                case Key.R:
                    this.reloadWeapon()
                    break
            }

        })
    }

    swapWeapon() {
        Flogger.log('PlayerWeaponHolster', 'swapWeapon')

        const weaponStatus = (this.currentWeaponStatus === CurrentWeaponStatus.Primary)
            ? CurrentWeaponStatus.Secondary : CurrentWeaponStatus.Primary

        this.setWeaponStatus(weaponStatus)
    }

    reloadWeapon() {
        Flogger.log('PlayerWeaponHolster', 'reloadWeapon')

        this.currentWeapon.requestReload()
    }

    setWeaponStatus(status: CurrentWeaponStatus) {
        this.currentWeaponStatus = status

        this.updateWeaponStatus()
    }

    setCurrentWeapon(name: WeaponName) {
        this.primaryWeapon.configureByName(name)
    }

    setSecondaryWeapon(name: WeaponName) {
        this.secondaryWeapon.configureByName(name)
    }

    setLoadout(loadout: WeaponHolsterLoadout) {
        const ammoStatusComponent = InGameHUD.getInstance().ammoStatus

        if (loadout.primaryWeaponName !== undefined) {
            this.primaryWeapon.configureByName(loadout.primaryWeaponName)
        }

        if (loadout.secondaryWeaponName !== undefined) {
            this.secondaryWeapon.configureByName(loadout.secondaryWeaponName)
        }

        this.currentLoadout = loadout
        this.currentWeaponStatus = CurrentWeaponStatus.Primary
        this.updateWeaponStatus()

        setTimeout(() => {
            ammoStatusComponent.refreshClientLoadout()
        }, 100)
    }

    holsterWeapon() {
        Flogger.log('PlayerWeaponHolster', 'holsterWeapon')

        this.currentWeaponStatus = CurrentWeaponStatus.None
        this.updateWeaponStatus()
    }

    private updateWeaponStatus() {
        switch (this.currentWeaponStatus) {
            case CurrentWeaponStatus.None:
                this.currentWeapon = this.handsWeapon
            case CurrentWeaponStatus.Primary:
                this.currentWeapon = this.primaryWeapon
                break
            case CurrentWeaponStatus.Secondary:
                this.currentWeapon = this.secondaryWeapon
                break
        }

        try {
            this.player.equipWeapon(this.currentWeapon as Weapon)
        } catch (error) {
            Flogger.error('PlayerWeaponHolster', 'Failed to equip weapon', 'error', error)
        }
    }

    private mouseDown() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Dead) {
            return
        }

        if (this.currentWeapon
        && this.currentWeapon.triggerDown !== undefined) {
            this.currentWeapon.triggerDown = true
        }
    }

    private mouseUp() {
        this.primaryWeapon.triggerDown = false
        this.secondaryWeapon.triggerDown = false
    }
}
