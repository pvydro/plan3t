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
        const minGrowth = 4
        const tileColorValue: SphericalTileColorData = SphericalTileValues.BaseGroundTile
        
        // Top bumps
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                const randomThreshold = Math.floor(Math.random() * growThreshold) + minGrowth
                let rightPixelImageData = context.getImageData(x + randomThreshold, y, 1, 1)
                const rightA = rightPixelImageData.data[3] / 255

                if (rightA !== 0) {
                    rightPixelImageData = SphericalManipulator.applyTileDataToImageData(rightPixelImageData, tileColorValue)
                    for (var i = 0; i < randomThreshold; i++) {
                        context.putImageData(rightPixelImageData, x + i, y)
                    }
                } 
            }
        }

        // Bottom bunp
        for (var x = width; x >= 0; x--) {
            for (var y = 0; y < height; y++) {
                const randomThreshold = Math.floor(Math.random() * growThreshold) + 1 
                let leftPixelImageData = context.getImageData(x - randomThreshold, y, 1, 1)
                const topA = leftPixelImageData.data[3] / 255

                if (topA !== 0) {
                    leftPixelImageData = SphericalManipulator.applyTileDataToImageData(leftPixelImageData, tileColorValue)
                    
                    for (var i = 0; i < randomThreshold; i++) {
                        context.putImageData(leftPixelImageData, x - i, y)
                    }
                }
            }
        }

        return context
    }
}
