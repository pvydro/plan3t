import { cloneCanvas, recolorCanvas2DContext } from '../../../utils/CanvasHelper'
import { SphericalTileValues } from '../SphericalTileHelper'

/**
 * 
 */

export interface ISphericalLayerGenerator {

}

export class SphericalLayerGenerator implements ISphericalLayerGenerator {
    static GroundLayerEstatePercent = 0.7

    private constructor() {}

    static async generateSphericalLayersToCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D> {
        return new Promise((resolve, reject) => {
            let newContext


            newContext = SphericalLayerGenerator.generateCoreCell(canvas, context, SphericalLayerGenerator.GroundLayerEstatePercent)

            resolve(newContext)
        })
    }

    static async generateCoreCell(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, estatePercent: number): Promise<CanvasRenderingContext2D> {
        return new Promise((resolve, reject) => {
            let clonedImage = new Image()
            clonedImage.src = canvas.toDataURL()
            
            clonedImage.onload = () => {
                const newWidth = canvas.width * estatePercent
                const newHeight = canvas.height * estatePercent
                const x = (canvas.width / 2) - (newWidth / 2)
                const y = (canvas.height / 2) - (newHeight / 2)
                const clonedCanvas = cloneCanvas(canvas)
                let clonedCtx = clonedCanvas.getContext('2d')
                
                clonedCtx = recolorCanvas2DContext(clonedCanvas, clonedCtx, SphericalTileValues.GrassGroundTile)
                clonedImage.src = clonedCanvas.toDataURL()

                clonedImage.onload = function() {
                    context.drawImage(clonedImage, x, y, newWidth, newHeight)

                    clonedCtx = undefined
                    clonedImage = undefined

                    resolve(context)
                }
            }
        })
    }
}
