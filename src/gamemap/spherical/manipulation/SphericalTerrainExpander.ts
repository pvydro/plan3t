import { SphericalTileColorData } from '../SphericalTile'
import { SphericalTileValues } from '../SphericalTileHelper'
import { SphericalManipulator } from './SphericalManipulator'

export interface ISphericalTerrainExpander {

}

export class SphericalTerrainExpander implements ISphericalTerrainExpander {
    private constructor() {}

    static expandSphericalTerrain(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, terrainGrowThreshold?: number): CanvasRenderingContext2D {
        const width = canvas.width
        const height = canvas.height
        const growThreshold = terrainGrowThreshold ?? 4
        const tileColorValue: SphericalTileColorData = SphericalTileValues.BaseGroundTile
        
        // Top bumps
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                const randomThreshold = Math.floor(Math.random() * growThreshold) + 1
                let bottomPixelImageData = context.getImageData(x, y + randomThreshold, 1, 1)
                const bottomA = bottomPixelImageData.data[3] / 255

                if (bottomA !== 0) {
                    bottomPixelImageData = SphericalManipulator.applyTileDataToImageData(bottomPixelImageData, tileColorValue)
                    for (var i = 0; i < randomThreshold; i++) {
                        context.putImageData(bottomPixelImageData, x, y + i)
                    }
                } 
            }
        }

        // Bottom bunp
        for (var x = 0; x < width; x++) {
            for (var y = height; y >= 0; y--) {
                const randomThreshold = Math.floor(Math.random() * growThreshold) + 1 
                let topPixelImageData = context.getImageData(x, y - randomThreshold, 1, 1)
                const topA = topPixelImageData.data[3] / 255

                if (topA !== 0) {
                    topPixelImageData = SphericalManipulator.applyTileDataToImageData(topPixelImageData, tileColorValue)
                    
                    for (var i = 0; i < randomThreshold; i++) {
                        context.putImageData(topPixelImageData, x, y - i)
                    }
                }
            }
        }

        return context
    }
}
