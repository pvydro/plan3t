import { Container } from '../../display/Container'
import { IDemolishable } from '../../interface/IDemolishable'
import { Dimension } from '../../math/Dimension'
import { ISphericalBuilder, SphericalBuilder } from './SphericalBuilder'

export enum SphericalBiome {
    CloningFacility = 'cloningfacility'
}

export interface ISpherical extends IDemolishable {
    
}

export interface SphericalData {
    points: SphericalPoint[]
    biome: SphericalBiome
    dimension: Dimension
}

export interface SphericalPoint {
    x: number
    y: number
    tileValue: number
    tileDepth: number
}

export class Spherical extends Container implements ISpherical {
    builder: ISphericalBuilder

    biome: SphericalBiome
    dimension: Dimension

    constructor(data: SphericalData) {
        super()

        this.builder = new SphericalBuilder()
        this.biome = data.biome
        this.dimension = data.dimension

        const sphericalContainer = this.builder.buildSphericalFromData(data)

        this.addChild(sphericalContainer)
    }

    demolish() {
        
    }
}
