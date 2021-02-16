import { Weapon } from '../../../weapon/Weapon'
import { WeaponStatePack } from './WeaponStatePack'

export class WeaponStateFormatter {
    private constructor() {}

    static convertWeaponToPack(weapon: Weapon): WeaponStatePack {
        const bulletX = weapon._currentRotatedBarrelPoint.x
        const bulletY = weapon._currentRotatedBarrelPoint.y

        const payload: WeaponStatePack = {
            rotation: weapon.playerHolster.player.hand.rotation,
            bulletX,
            bulletY
        }

        return payload
    }
}
