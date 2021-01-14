import { IParticle, Particle } from './Particle'

export interface IMuzzleFlashParticle extends IParticle {

}

export class MuzzleFlashParticle extends Particle implements IMuzzleFlashParticle {
    constructor() {
        super()
    }
}
