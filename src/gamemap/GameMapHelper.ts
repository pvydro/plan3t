import { Assets, AssetUrls } from '../asset/Assets'
import { LoggingService } from '../service/LoggingService'

export interface ColorData {
    red: number
    green: number
    blue: number
    alpha: number
}

export interface IGameMapHelper {

}

export class GameMapHelper implements IGameMapHelper {

    private constructor() {

    }

    static async getRandomSpherical(): Promise<any> {
        LoggingService.log('GameMapHelper', 'getRandomSpherical')

        return new Promise((resolve, reject) => {
            const sphericalImage = new Image()
            sphericalImage.src = AssetUrls.SPHERICAL_TEST + '.png'
    
            sphericalImage.onload = () => {
                LoggingService.log('GameMapHelper', 'getRandomSpherical', 'image loaded')

                const sphericalCanvas = GameMapHelper.convertImageToCanvas(sphericalImage)
                const canvasData = GameMapHelper.getCanvasImageData(sphericalCanvas)
        
                return resolve(canvasData)
            }

            sphericalImage.onerror = (error) => {
                LoggingService.error('GameMapHelper', 'getRandomSpherical', 'image failed to load', error)

                reject(error)
            }
        })
    }
    
    private static convertImageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
        
        const canvas = document.createElement('canvas')
        
        canvas.width = image.width
        canvas.height = image.height
        canvas.getContext('2d').drawImage(image, 0, 0)
        
        return canvas
    }
    
    private static getCanvasImageData(canvas: HTMLCanvasElement): ColorData[] {
        const context = canvas.getContext('2d')
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const rawColorData = imageData.data
        const colorData: ColorData[] = []
        
        for(let i = 0; i < rawColorData.length; i += 4) {
            const red = rawColorData[i]
            const green = rawColorData[i + 1]
            const blue = rawColorData[i + 2]
            const alpha = rawColorData[i + 3]
            const parsedData: ColorData = {
                red, green, blue, alpha
            }
            
            colorData.push(parsedData)
        }
        
        return colorData
    }

    getRandomSpherical(): HTMLImageElement {
        return Assets.get(AssetUrls.SPHERICAL_TEST)
    }
}
