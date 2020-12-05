export interface IWeapon {
    damage: number
    fireRate?: number
    weight?: number
    bulletsPerClip?: number
    numberOfClips?: number
}

export class Weapon implements IWeapon {
    damage: number
    fireRate?: number
    weight?: number
    bulletsPerClip?: number
    numberOfClips?: number

    constructor() {

    }

    configure(model: IWeapon) {

    }
}

export enum WeaponName {
    
}