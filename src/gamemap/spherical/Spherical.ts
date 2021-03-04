import { Container } from '../../engine/display/Container'
import { IDemolishable } from '../../interface/IDemolishable'
import { Dimension } from '../../engine/math/Dimension'
import { ISphericalBuilder, SphericalBuilder, SphericalResponse } from './SphericalBuilder'
import { SphericalBiome, SphericalData } from './SphericalData'
import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { ShowCollisionDebug } from '../../utils/Constants'
import { Rect } from '../../engine/math/Rect'

export interface ISpherical extends IDemolishable {
    collisionRects: Rect[]
    tileLayer: Container
    initializeSpherical(): Promise<void>
}

export class Spherical extends Container implements ISpherical {
    builder: ISphericalBuilder
    collisionRects: Rect[] 
    collisionDebugger: CollisionDebugger
    tileLayer: Container

    data: SphericalData
    biome: SphericalBiome
    dimension: Dimension

    constructor(data: SphericalData) {
        super()

        this.builder = new SphericalBuilder()
        this.data = data
        this.biome = data.biome
        this.dimension = data.dimension    
    }

    async initializeSpherical(): Promise<void> {
        return new Promise((resolve) => {
            this.builder.buildSphericalFromData(this.data).then((response: SphericalResponse) => {
                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects
        
                this.addChild(this.tileLayer)
                
                if (ShowCollisionDebug) {
                    this.collisionDebugger = new CollisionDebugger({
                        lineWidth: 0.5,
                        collisionRects: response.collisionRects
                    })
                    
                    this.collisionDebugger.initializeAndShowGraphics()
                    this.addChild(this.collisionDebugger)
                }

                resolve()
            })
        })
    }

    demolish() {
        
    }
}
