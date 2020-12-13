import { Container } from '../../engine/display/Container'
import { IDemolishable } from '../../interface/IDemolishable'
import { Dimension } from '../../engine/math/Dimension'
import { ISphericalBuilder, SphericalBuilder } from './SphericalBuilder'
import { SphericalBiome, SphericalData } from './SphericalData'
import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { ShowCollisionDebug } from '../../utils/Constants'

export interface ISpherical extends IDemolishable {
    
}

export class Spherical extends Container implements ISpherical {
    builder: ISphericalBuilder
    collisionDebugger: CollisionDebugger

    biome: SphericalBiome
    dimension: Dimension

    constructor(data: SphericalData) {
        super()

        this.builder = new SphericalBuilder()
        this.biome = data.biome
        this.dimension = data.dimension
        
        const sphericalRespone = this.builder.buildSphericalFromData(data)
        const sphericalContainer = sphericalRespone.tileLayer

        this.addChild(sphericalContainer)
        
        if (ShowCollisionDebug) {
            this.collisionDebugger = new CollisionDebugger({
                lineWidth: 0.5,
                collisionRectangles: sphericalRespone.collisionRects
            })
            this.collisionDebugger.initializeAndShowGraphics()
            this.addChild(this.collisionDebugger)
        }
    }

    demolish() {
        
    }
}
