import { ISphericalData, SphericalData, SphericalPoint } from './SphericalData'
import { Assets } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { Dimension } from '../../engine/math/Dimension'
import { Container } from '../../engine/display/Container'
import { LoggingService } from '../../service/LoggingService'
import { IRect, Rect } from '../../engine/math/Rect'
import { SphericalHelper } from './SphericalHelper'

export interface ISphericalBuilder {
    buildSphericalFromData(data: ISphericalData): SphericalResponse
}

export interface SphericalResponse {
    tileLayer: Container
    collisionRects: IRect[]
}

export class SphericalBuilder implements ISphericalBuilder {

    constructor() {}

    buildSphericalFromData(data: SphericalData) {
        LoggingService.log('SphericalBuilder', 'buildSphericalFromData')

        const tileLayer = new Container()

        // Construct tileLayer
        data.points.forEach((point: SphericalPoint) => {
            if (SphericalHelper.isPointSolid(point)) {
                const newTileTexture = SphericalHelper.getTextureForPoint(point, data.biome)
                const newTileSprite = new Sprite({ texture: newTileTexture })
                
                newTileSprite.x = point.x * newTileTexture.width
                newTileSprite.y = point.y * newTileTexture.height

                tileLayer.addChild(newTileSprite)
            }
        })

        // Construct collision layer
        const collisionRects = this.buildCollisionRectanglesFromData(data)

        return {
            tileLayer,
            collisionRects
        }
    }

    private buildCollisionRectanglesFromData(data: SphericalData): IRect[] {
        LoggingService.log('SphericalBuilder', 'buildCollisionLayerFromData')

        const collisionRects: IRect[] = []
        const tileSize = SphericalHelper.getTileSizeForBiome(data.biome)
        
        for (var y = 0; y < data.dimension.height; y++) {
            let isOnACollidableTile = false
            let currentCollisionRect: IRect = undefined

            for (var x = 0; x < data.dimension.width; x++) {
                const currentPoint = data.getPointAt(x, y)

                if (currentPoint.tileDepth > 0) {
                    // Start Rect
                    if (isOnACollidableTile == false) {
                        isOnACollidableTile = true
                        currentCollisionRect = Rect.Zero
                        currentCollisionRect.x = x * tileSize
                    }

                    currentCollisionRect.width += tileSize
                } else {
                    // Finish Rect
                    if (isOnACollidableTile) {
                        isOnACollidableTile = false
                        
                        collisionRects.push(currentCollisionRect)

                        currentCollisionRect = undefined
                    }
                }
            }
        }

        return collisionRects
    }
}
