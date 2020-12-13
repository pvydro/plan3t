import { Assets, AssetUrls } from '../asset/Assets'
import { Dimension } from '../math/Dimension'
import { LoggingService } from '../service/LoggingService'
import { GameMap } from './GameMap'
import { SphericalBiome, SphericalData, SphericalPoint } from './spherical/Spherical'

export interface PixelData {
    red: number
    green: number
    blue: number
    alpha: number
    x: number
    y: number
}

export interface IGameMapHelper {

}

export class GameMapHelper implements IGameMapHelper {

    private constructor() {}

    static async getRandomSphericalData(): Promise<any> {
        LoggingService.log('GameMapHelper', 'getRandomSpherical')

        return new Promise((resolve, reject) => {
            const sphericalImage = new Image()
            sphericalImage.src = AssetUrls.SPHERICAL_TEST + '.png'
    
            sphericalImage.onload = () => {
                LoggingService.log('GameMapHelper', 'getRandomSpherical', 'image loaded')

                const sphericalCanvas = GameMapHelper.convertImageToCanvas(sphericalImage)
                const pixelData = GameMapHelper.getPixelDataFromCanvas(sphericalCanvas)
                const sphericalData = GameMapHelper.convertPixelDataToSphericalData(pixelData, sphericalCanvas)
        
                return resolve(sphericalData)
            }

            sphericalImage.onerror = (error) => {
                LoggingService.error('GameMapHelper', 'getRandomSpherical', 'image failed to load', error)

                reject(error)
            }
        })
    }
    
    private static convertPixelDataToSphericalData(pixelData: PixelData[], canvas: HTMLCanvasElement): SphericalData {
        const points: SphericalPoint[] = []

        pixelData.forEach((pixel: PixelData) => {
            const tileValue = pixel.red
            const tileDepth = pixel.alpha
            const x = pixel.x
            const y = pixel.y

            points.push({
                tileValue, tileDepth, x, y
            })
        })

        const sphericalData: SphericalData = {
            points,
            biome: SphericalBiome.CloningFacility,
            dimension: new Dimension(canvas.width, canvas.height)
        }

        return sphericalData
    }

    private static convertImageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
        const canvas = document.createElement('canvas')
        
        canvas.width = image.width
        canvas.height = image.height
        canvas.getContext('2d').drawImage(image, 0, 0)
        
        return canvas
    }
    
    private static getPixelDataFromCanvas(canvas: HTMLCanvasElement): PixelData[] {
        const context = canvas.getContext('2d')
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const rawColorData = imageData.data
        const colorData: PixelData[] = []
        
        for (let i = 0; i < rawColorData.length; i += 4) {
            const red = rawColorData[i]
            const green = rawColorData[i + 1]
            const blue = rawColorData[i + 2]
            const alpha = rawColorData[i + 3]
            let x = i / 4 % canvas.width
            let y = (i / 4 - x) / canvas.width;

            const parsedData: PixelData = {
                red, green, blue, alpha, x, y
            }
            
            colorData.push(parsedData)
        }
        
        return colorData
    }

    getRandomSpherical(): HTMLImageElement {
        return Assets.get(AssetUrls.SPHERICAL_TEST)
    }
}
