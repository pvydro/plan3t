import { SphericalTileColorData } from '../tile/SphericalTile'
import { SphericalTileValues } from '../tile/SphericalTileHelper'
import { SphericalManipulator } from './SphericalManipulator'

export interface ISphericalTerrainExpander {

}

export class SphericalTerrainExpander implements ISphericalTerrainExpander {
    private constructor() {}

    static async expandSphericalTerrain(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, terrainGrowThreshold?: number): Promise<CanvasRenderingContext2D> {
        return new Promise((resolve, reject) => {
            const width = canvas.width
            const height = canvas.height
            const growThreshold = terrainGrowThreshold ?? width / 12
            const tileColorValue: SphericalTileColorData = SphericalTileValues.CoreGrassTile
            
            // Left bumps
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const randomThreshold = Math.floor(Math.random() * growThreshold)
                    let rightPixelImageData = context.getImageData(x + randomThreshold, y, 1, 1)
                    const rightA = rightPixelImageData.data[3] / 255
    
                    if (rightA !== 0) {
                        rightPixelImageData = SphericalManipulator.applyTileDataToImageData(rightPixelImageData, tileColorValue)
                        for (let i = 0; i < randomThreshold; i++) {
                            context.putImageData(rightPixelImageData, x + i, y)
                        }
                    } 
                }
            }
    
            // Right bunps
            for (let x = width; x >= 0; x--) {
                for (let y = 0; y < height; y++) {
                    const randomThreshold = Math.floor(Math.random() * growThreshold) + 1 
                    let leftPixelImageData = context.getImageData(x - randomThreshold, y, 1, 1)
                    const topA = leftPixelImageData.data[3] / 255
    
                    if (topA !== 0) {
                        leftPixelImageData = SphericalManipulator.applyTileDataToImageData(leftPixelImageData, tileColorValue)
                        
                        for (let i = 0; i < randomThreshold; i++) {
                            context.putImageData(leftPixelImageData, x - i, y)
                        }
                    }
                }
            }
    
            // Top & bottom bump
            const cloneImage = new Image()
            const cloneHeightMultiplier = 1.1
            cloneImage.src = canvas.toDataURL()
    
            cloneImage.onload = () => {
                const newWidth = width * 0.5
                const newHeight = height * cloneHeightMultiplier
                const x = (width / 2) - (newWidth / 2)
                const y = (height / 2) - (newHeight / 2)
                context.drawImage(cloneImage, x, y, newWidth, newHeight)

                resolve(context)
            }
    
        })
    }
}
