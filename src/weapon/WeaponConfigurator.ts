import { Camera } from '../camera/Camera'
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
    baseWeaponRotation: number = 0.1
    targetWeaponRotation: number = this.baseWeaponRotation

    constructor(weapon: IWeapon) {
        this.weapon = weapon
    }

    update() {
        this.positionWeapon()
        this.rotateWithMouse()
    }

    positionWeapon() {
        if (this.weapon.state === WeaponState.AttachmentsMode) {
            const middle = {
                x: 0,
                y: camera.toScreen({ x: 0, y: -GameWindow.height / 3 })
            }
            const targetScale = 3

            this.weapon.x = lerp(this.weapon.x, middle.x, 0.1)
            this.weapon.scale.x = lerp(this.weapon.scale.x, targetScale, 0.1)
            this.weapon.scale.y = lerp(this.weapon.scale.y, targetScale, 0.1)

            if (this.weapon.playerHolster) {
                this.weapon.playerHolster.player.hand.rotation = 0
            }
        }
    }

    rotateWithMouse() {
        // const distanceY = camera.viewport.halfHeight - Camera.Mouse.y

        const distanceY = camera._mouseY - (window.innerHeight / 2)
        const distanceDivisor = GameWindow.halfHeight
        const rotationMultiplier = distanceY / distanceDivisor
        const targetRotation = this.baseWeaponRotation * rotationMultiplier

        this.targetWeaponRotation += (targetRotation - this.targetWeaponRotation) / 250
        this.weapon.rotation = lerp(this.weapon.rotation, this.targetWeaponRotation, 0.1)
    }
}
