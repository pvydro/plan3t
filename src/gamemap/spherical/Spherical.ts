import { Container } from '../../engine/display/Container'
import { Dimension } from '../../engine/math/Dimension'
import { ISphericalBuilder, SphericalBuilder, SphericalResponse } from './SphericalBuilder'
import { SphericalBiome, SphericalData } from './SphericalData'
import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { Rect } from '../../engine/math/Rect'
import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'

export interface ISpherical extends IGameMapContainer {

}

export class Spherical extends GameMapContainer implements ISpherical {
    builder: ISphericalBuilder
    collisionRects: Rect[] 
    collisionDebugger: CollisionDebugger
    tileLayer?: Container

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

    initializeMap(): Promise<void> {
        if (this.tileLayer !== undefined) {
            this.clearMap()
        }

        return new Promise((resolve) => {
            this.builder.buildSphericalFromData(this.data).then((response: SphericalResponse) => {
                this.tileLayer = response.tileLayer
                this.collisionRects = response.collisionRects
        
                this.addChild(this.tileLayer)

                super.initializeMap()

                resolve()
            })
        })
    }

    demolish() {
        
    }
}
