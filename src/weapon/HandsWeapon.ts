import { IWeapon, Weapon } from './Weapon'

export interface IHandsWeapon extends IWeapon {

}

export class HandsWeapon extends Weapon implements IHandsWeapon {
    constructor() {
        super()
    }

    async shoot(): Promise<void> {
        if (!this.currentShootPromise) {
            this.currentShootPromise = new Promise((resolve) => {

            })
        }

        return this.currentShootPromise
    }
}
