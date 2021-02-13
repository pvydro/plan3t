import { IParticle, Particle } from './Particle'

export interface ITextParticle extends IParticle {

}

export class TextPaticle extends  Particle implements ITextParticle {
    constructor() {
        super({})
    }
}
