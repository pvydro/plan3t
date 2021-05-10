import { Container } from '../../engine/display/Container'
import { Dimension } from '../../engine/math/Dimension'
import { ISphericalBuilder, SphericalBuilder, SphericalResponse } from './SphericalBuilder'
import { SphericalBiome, SphericalData } from './SphericalData'
import { CollisionDebugger } from '../../engine/collision/CollisionDebugger'
import { Rect } from '../../engine/math/Rect'
import { GameMapContainer, IGameMapContainer } from '../GameMapContainer'
import { exists } from '../../utils/Utils'

export interface ISpherical extends IGameMapContainer {

}

export class Spherical extends GameMapContainer implements ISpherical {
    builder: ISphericalBuilder
    collisionRects: Rect[] 
    collisionDebugger: CollisionDebugger
    tileLayer?: Container
    natureLayer?: Container

    data: SphericalData
    biome: SphericalBiome
    _dimension: Dimension

    constructor(data: SphericalData) {
        super()

        this.builder = new SphericalBuilder()
        this.data = data
        this.biome = data.biome
        this._dimension = data.dimension
    }

    initializeMap(): Promise<void> {
        if (this.tileLayer !== undefined) {
            this.clearMap()
        }

        return new Promise((resolve) => {
            this.builder.buildSphericalFromData(this.data).then((response: SphericalResponse) => {
                this.tileLayer = response.tileLayer
                this.natureLayer = response.natureLayer
                this.collisionRects = response.collisionRects

                if (exists(this.natureLayer)) this.addChild(this.natureLayer)
                if (exists(this.tileLayer)) this.addChild(this.tileLayer)

                super.initializeMap()

                resolve()
            })
        })
    }

    demolish() {
        
    }

    get dimension() {
        return this._dimension
    }
}
