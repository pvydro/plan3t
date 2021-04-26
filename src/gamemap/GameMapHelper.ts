import { Assets, AssetUrls } from '../asset/Assets'
import { Dimension } from '../engine/math/Dimension'
import { Flogger } from '../service/Flogger'
import { SphericalManipulator } from './spherical/manipulation/SphericalManipulator'
import { SphericalData, SphericalBiome, ISphericalData } from './spherical/SphericalData'
import { SphericalPoint } from './spherical/SphericalPoint'

export interface PixelData {
    r: number
    g: number
    b: number
    a: number
    x: number
    y: number
}

export interface IGameMapHelper {

}

export class GameMapHelper implements IGameMapHelper {

    private constructor() {}

    static async getRandomSphericalData(): Promise<SphericalData> {
        Flogger.log('GameMapHelper', 'getRandomSpherical')

        return new Promise(async (resolve, reject) => {
            const sphericalImage = new Image()
            sphericalImage.src = AssetUrls.SphericalSM + '.png'
    
            sphericalImage.onload = () => {
                Flogger.log('GameMapHelper', 'getRandomSpherical', 'image loaded')

                const sphericalCanvas = GameMapHelper.convertImageToCanvas(sphericalImage)
                
                SphericalManipulator.manipulateSphericalCanvas(sphericalCanvas).then((manipulated) => {
                    const pixelData = GameMapHelper.getPixelDataFromCanvas(manipulated)
                    const sphericalData = GameMapHelper.convertPixelDataToSphericalData(pixelData, sphericalCanvas)

                    resolve(sphericalData)
                })
        
            }

            sphericalImage.onerror = (error) => {
                Flogger.error('GameMapHelper', 'getRandomSpherical', 'image failed to load', error)

                reject(error)
            }
        })
    }

    getSpaceshipSphericalData(): Promise<SphericalData> {
        Flogger.log('GameMapHelper', 'getSpaceshipSphericalData')

        return new Promise(async (resolve, reject) => {

        })
    }
    
    private static convertPixelDataToSphericalData(pixelData: PixelData[], canvas: HTMLCanvasElement): SphericalData {
        const points: SphericalPoint[] = []

        pixelData.forEach((pixel: PixelData) => {
            const tileValue = { r: pixel.r, g: pixel.g, b: pixel.b, a: pixel.a }
            const tileSolidity = pixel.a
            const x = pixel.x
            const y = pixel.y

            points.push(new SphericalPoint({ tileValue, tileSolidity: tileSolidity, x, y }))
        })

        const sphericalData = new SphericalData({
            points,
            biome: SphericalBiome.Kepler,
            dimension: new Dimension(canvas.width, canvas.height)
        })

        return sphericalData
    }

    private static convertImageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
        const canvas = document.createElement('canvas')
        const expansionWidth = canvas.width / 4

        canvas.width = image.width + expansionWidth
        canvas.height = image.height + expansionWidth
        canvas.getContext('2d').drawImage(image, expansionWidth / 2, expansionWidth / 2)
        
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
                r: red, g: green, b: blue, a: alpha, x, y
            }
            
            colorData.push(parsedData)
        }
        
        return colorData
    }

    getRandomSpherical(): HTMLImageElement {
        return Assets.get(AssetUrls.SphericalTest)
    }
}
