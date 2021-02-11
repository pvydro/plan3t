import { ISphericalData, SphericalData } from './SphericalData'
import { Sprite } from '../../engine/display/Sprite'
import { Container } from '../../engine/display/Container'
import { Flogger } from '../../service/Flogger'
import { Rect } from '../../engine/math/Rect'
import { SphericalHelper } from './SphericalHelper'
import { DebugConstants, GlobalScale } from '../../utils/Constants'
import { SphericalTile, SphericalTileColorData } from './tile/SphericalTile'
import { SphericalTileHelper } from './tile/SphericalTileHelper'
import { IVector2 } from '../../engine/math/Vector2'
import { SphericalPoint } from './SphericalPoint'

export interface ISphericalBuilder {
    buildSphericalFromData(data: ISphericalData): Promise<SphericalResponse>
}

export interface SphericalResponse {
    tileLayer: Container
    collisionRects: Rect[]
}

export class SphericalBuilder implements ISphericalBuilder {

    constructor() {}

    async buildSphericalFromData(data: SphericalData) {
        Flogger.log('SphericalBuilder', 'buildSphericalFromData')

        const tileLayer = new Container()

        // Construct tileLayer
        for (let i = 0; i < data.points.length; i++) {
            const point = data.points[i]
            if (SphericalHelper.isPointSolid(point)) {
                const newX = point.x * SphericalHelper.getTileSize()
                const newY = point.y * SphericalHelper.getTileSize()
                const biome = data.biome
                const tileData: SphericalTileColorData = SphericalTileHelper.matchColorDataToTileValue(point.tileValue)
                const tilesheetUrl: string = SphericalTileHelper.getTilesheetFromColorData(tileData, data.biome)
                const tileCoords: IVector2 = SphericalTileHelper.getTilesheetCoordsFromPoint(point)
                const texture: PIXI.Texture = await SphericalTileHelper.getTileTextureFromTilesheetCoords(tilesheetUrl, tileCoords)
                const canGrowFoliage: boolean = DebugConstants.DisableFoliage ? false : SphericalTileHelper.canPointGrowFoliage(point as SphericalPoint)

                const newTileSprite = new SphericalTile({ texture, data, point, biome, canGrowFoliage })
                
                newTileSprite.x = newX
                newTileSprite.y = newY

                tileLayer.addChild(newTileSprite)
            }
        }

        // Construct collision layer
        const collisionRects = this.buildCollisionRectanglesFromData(data)

        return {
            tileLayer,
            collisionRects
        }
    }

    private buildCollisionRectanglesFromData(data: SphericalData): Rect[] {
        Flogger.log('SphericalBuilder', 'buildCollisionLayerFromData')

        const collisionRects: Rect[] = []
        const tileSize = SphericalHelper.getTileSizeForBiome(data.biome)
        
        for (let y = 0; y < data.dimension.height; y++) {
            let isOnACollidableTile = false
            let currentCollisionRect: Rect = undefined

            for (let x = 0; x < data.dimension.width; x++) {
                const currentPoint = data.getPointAt(x, y)

                if (currentPoint) {
                    if (currentPoint.tileSolidity > 0) {
                        // Start Rect
                        if (isOnACollidableTile == false) {
                            isOnACollidableTile = true
    
                            currentCollisionRect = Rect.Zero
                            currentCollisionRect.position = {
                                x: x * tileSize,
                                y: y * tileSize
                            }
    
                            collisionRects.push(currentCollisionRect)
                        }
    
                        currentCollisionRect.height = tileSize
                        currentCollisionRect.width += tileSize
                    } else {
                        // Finish Rect
                        if (isOnACollidableTile) {
                            isOnACollidableTile = false
    
                            currentCollisionRect = undefined
                        }
                    }
                }
            }
        }

        // Scale all collision rects up by GlobalScale
        collisionRects.forEach((rect: Rect) => {
            rect.x *= GlobalScale
            rect.y *= GlobalScale
            rect.width *= GlobalScale
            rect.height *= GlobalScale
        })

        return collisionRects
    }
}
