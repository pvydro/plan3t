import { Direction } from '../../../engine/math/Direction'
import { Weapon } from '../../../weapon/Weapon'
import { WeaponStatePack } from './WeaponStatePack'

export class WeaponStateFormatter {
    private constructor() {}

    static convertWeaponToPack(weapon: Weapon): WeaponStatePack {
        const bulletX = weapon._currentRotatedBarrelPoint.x
        const bulletY = weapon._currentRotatedBarrelPoint.y
        const bulletVelocity = weapon.bulletVelocity
        const direction = weapon.playerHolster && weapon.playerHolster.player !== undefined
            ? weapon.playerHolster.player.direction : Direction.Right

        const payload: WeaponStatePack = {
            name: weapon.name,
            rotation: weapon.playerHolster.player.hand.rotation,
            direction,
            bulletX,
            bulletY,
            bulletVelocity
        }

        return payload
    }
}
