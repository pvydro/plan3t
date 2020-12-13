import { Container } from '../../engine/display/Container'
import { IDemolishable } from '../../interface/IDemolishable'
import { Dimension } from '../../engine/math/Dimension'
import { ISphericalBuilder, SphericalBuilder } from './SphericalBuilder'
import { SphericalBiome, SphericalData } from './SphericalData'
import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { GlobalScale, ShowCollisionDebug } from '../../utils/Constants'
import { Rect } from '../../engine/math/Rect'

export interface ISpherical extends IDemolishable {
    collisionRects: Rect[]
}

export class Spherical extends Container implements ISpherical {
    builder: ISphericalBuilder
    collisionRects: Rect[] 
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

        this.collisionRects = sphericalRespone.collisionRects

        this.addChild(sphericalContainer)
        
        if (ShowCollisionDebug) {
            this.collisionDebugger = new CollisionDebugger({
                lineWidth: 3,
                collisionRects: sphericalRespone.collisionRects
            })
            this.collisionDebugger.scale.set(0.2, 0.2)
            this.collisionDebugger.initializeAndShowGraphics()
            this.addChild(this.collisionDebugger)
        }
    }

    demolish() {
        
    }
}
