import { Direction } from '../../../engine/math/Direction'
import { Weapon } from '../../../weapon/Weapon'
import { BulletStatePack, WeaponStatePack } from './WeaponStatePack'

export class WeaponStateFormatter {
    private constructor() {}

    static convertWeaponToPack(weapon: Weapon): WeaponStatePack {
        const sessionId = weapon.playerHolster.player.sessionId
        const direction = weapon.playerHolster && weapon.playerHolster.player !== undefined
            ? weapon.playerHolster.player.direction : Direction.Right

        const payload: WeaponStatePack = {
            name: weapon.name,
            rotation: weapon.playerHolster.player.hand.rotation,
            direction,
            sessionId
        }

        return payload
    }

    static convertWeaponToBullet(weapon: Weapon): BulletStatePack {
        const x = weapon._currentRotatedBarrelPoint.x
        const y = weapon._currentRotatedBarrelPoint.y
        const rotation = weapon.playerHolster.player.hand.rotation
        const bulletVelocity = weapon.bulletVelocity
        const playerId = weapon.playerHolster.player.sessionId
        
        const payload: BulletStatePack = {
            bulletVelocity,
            x, y, rotation,
            playerId,
        }

        return payload
    }
}
