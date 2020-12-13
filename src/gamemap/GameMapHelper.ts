import { Assets, AssetUrls } from '../asset/Assets'
import { IGameMap } from './GameMap'

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
    
    // static parseSphericalToArray(image: HTMLImageElement) {
        
    // }
    
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
