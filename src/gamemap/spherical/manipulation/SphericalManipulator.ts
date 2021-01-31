import { Flogger } from '../../../service/Flogger'
import { trimCanvas } from '../../../utils/CanvasHelper'
import { SphericalTileColorData } from '../tile/SphericalTile'
import { SphericalTileValues } from '../tile/SphericalTileHelper'
import { SphericalLayerGenerator } from './SphericalLayerGenerator'
import { SphericalTerrainExpander } from './SphericalTerrainExpander'

export interface ISphericalManipulator {

}

export class SphericalManipulator implements ISphericalManipulator {
    private constructor() {}

    static async manipulateSphericalCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
        Flogger.log('SphericalManipulator', 'manipulateSphericalCanvas')

        let context = canvas.getContext('2d')
        context.imageSmoothingEnabled = false

        context = await SphericalTerrainExpander.expandSphericalTerrain(canvas, context)
        context = await SphericalManipulator.smoothOutSpherical(canvas, context)
        context = await SphericalLayerGenerator.generateSphericalLayersToCanvas(canvas, context)

        canvas = trimCanvas(canvas)

        canvas.style.transform = 'scale(4) translate(200px, 200px)'
        // canvas.style.border = '1px dashed blue'
        document.body.appendChild(canvas)

        return canvas
    }

    private static async smoothOutSpherical(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D> {
        return new Promise((resolve, reject) => {
            const cloneImage = new Image()
            cloneImage.src = canvas.toDataURL()
    
            cloneImage.onload = () => {
                context.drawImage(cloneImage, 0, 1)
                context.drawImage(cloneImage, 0, -1)
                resolve(context)
            }
        })
    }

    public static applyTileDataToImageData(imageData: ImageData, tileColorData: SphericalTileColorData): ImageData {
        imageData.data[0] = tileColorData.r
        imageData.data[1] = tileColorData.g
        imageData.data[2] = tileColorData.b
        imageData.data[3] = 255

        return imageData
    }
}
