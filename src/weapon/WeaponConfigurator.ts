import { IVector2 } from '../engine/math/Vector2'
import { IUpdatable } from '../interface/IUpdatable'
import { camera } from '../shared/Dependencies'
import { GameWindow } from '../utils/Constants'
import { lerp } from '../utils/Math'
import { IWeapon, WeaponState } from './Weapon'

export interface IWeaponConfigurator extends IUpdatable {
}

export class WeaponConfigurator implements IWeaponConfigurator {
    weapon: IWeapon

    constructor(weapon: IWeapon) {
        this.weapon = weapon
    }

    update() {
        this.positionWeapon()
    }

    positionWeapon() {
        if (this.weapon.state === WeaponState.AttachmentsMode) {
            const middle = camera.toScreen({ x: GameWindow.halfWidth, y: -GameWindow.height / 3 })
            const targetScale = 3
            const targetRotation = -0.1

            this.weapon.x = lerp(this.weapon.x, middle.x, 0.1)
            // this.weapon.y = lerp(this.weapon.y, middle.y, 0.1)
            this.weapon.scale.x = lerp(this.weapon.scale.x, targetScale, 0.1)
            this.weapon.scale.y = lerp(this.weapon.scale.y, targetScale, 0.1)
            this.weapon.rotation = lerp(this.weapon.rotation, targetRotation, 0.1)

            if (this.weapon.playerHolster) {
                this.weapon.playerHolster.player.hand.rotation = 0
            }
        }
    }
}
