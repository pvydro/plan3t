import { Flogger } from '../../../service/Flogger'
import { trimCanvas } from '../../../utils/CanvasHelper'
import { SphericalTileColorData } from '../SphericalTile'
import { SphericalTileValues } from '../SphericalTileHelper'
import { SphericalTerrainExpander } from './SphericalTerrainExpander'

export interface ISphericalManipulator {

}

export class SphericalManipulator implements ISphericalManipulator {
    private constructor() {}

    static manipulateSphericalCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
        Flogger.log('SphericalManipulator', 'manipulateSphericalCanvas')

        let context = canvas.getContext('2d')

        context = SphericalManipulator.generateSphericalLayers(canvas, context)
        context = SphericalTerrainExpander.expandSphericalTerrain(canvas, context)

        canvas = trimCanvas(canvas)

        // canvas.style.transform = 'scale(4) translate(200px, 200px)'
        // document.body.appendChild(canvas)

        return canvas
    }

    private static generateSphericalLayers(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): CanvasRenderingContext2D {
        const width = canvas.width
        const height = canvas.height
        const tileColorValue: SphericalTileColorData = SphericalTileValues.BaseGroundTile

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {

                let iteratedPixelImageData = context.getImageData(x, y, 1, 1)
                const colorData: Uint8ClampedArray = iteratedPixelImageData.data

                const a = colorData[3] / 255

                if (a === 0) {
                    // Not solid
                } else {
                    iteratedPixelImageData = SphericalManipulator.applyTileDataToImageData(iteratedPixelImageData, tileColorValue)
                    context.putImageData(iteratedPixelImageData, x, y)
                }
            }
        }

        return context
    }

    public static applyTileDataToImageData(imageData: ImageData, tileColorData: SphericalTileColorData): ImageData {
        imageData.data[0] = tileColorData.r
        imageData.data[1] = tileColorData.g
        imageData.data[2] = tileColorData.b
        imageData.data[3] = 255

        return imageData
    }
}
