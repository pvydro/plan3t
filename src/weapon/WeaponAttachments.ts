import { IUpdatable } from '../interface/IUpdatable'
import { IWeapon } from './Weapon'
import { IWeaponConfigurator, WeaponConfigurator } from './WeaponConfigurator'

export interface IWeaponAttachments extends IUpdatable {
}

export class WeaponAttachments implements IWeaponAttachments {
    weapon: IWeapon
    configurator: IWeaponConfigurator

    constructor(weapon: IWeapon) {
        this.weapon = weapon
        this.configurator = new WeaponConfigurator(this.weapon)
    }

    update() {
        this.configurator.update()
    }
}
