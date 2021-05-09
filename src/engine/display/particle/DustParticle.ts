import { GravityParticle, GravityParticleOptions, IGravityParticle } from './GravityParticle'

export interface IDustParticle extends IGravityParticle {

}

export interface DustParticleOptions extends GravityParticleOptions {

}

export class DustParticle extends GravityParticle implements IDustParticle {
    constructor(options: DustParticleOptions) {
        options.color = 0xb8b8b8

        super(options)
    }
}
