import { GravityParticle, GravityParticleOptions, IGravityParticle } from './GravityParticle'

export interface IBloodParticle extends IGravityParticle {

}

export interface BloodGroupParticleOptions {
    totalParticles: number
}

export class BloodParticle extends GravityParticle implements IBloodParticle {
    constructor(options: GravityParticleOptions) {
        super(options)
    }
}
