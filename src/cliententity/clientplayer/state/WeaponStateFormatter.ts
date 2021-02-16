import { Weapon } from '../../../weapon/Weapon'
import { WeaponStatePack } from './WeaponStatePack'

export class WeaponStateFormatter {
    private constructor() {}

    static convertWeaponToPack(weapon: Weapon): WeaponStatePack {
        const payload: WeaponStatePack = {
            rotation: weapon.rotation
        }

        return payload
    }
}
