import { cloneCanvas, recolorCanvas2DContext } from '../../../utils/CanvasHelper'
import { SphericalTileColorData } from '../SphericalTile'
import { SphericalTileValues } from '../SphericalTileHelper'

/**
 * Cores:
 * 
 * * GrassCore -    100%
 * * DirtCore -     90%
 * * GroundCore -   80%
 * * MantleCore -   65%
 * * InnerCore -    25%
 */

export interface ISphericalLayerGenerator {

}

export class SphericalLayerGenerator implements ISphericalLayerGenerator {
    static DirtCorePercent = 0.95
    static GroundCorePercent = 0.8
    static MantleCorePercent = 0.5
    static InnerCorePercent = 0.25

    private constructor() {}

    static async generateSphericalLayersToCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D> {
        return new Promise((resolve, reject) => {
            let newContext

            // Dirt Core
            newContext = SphericalLayerGenerator.generateCoreCell(canvas, context,
                SphericalLayerGenerator.DirtCorePercent, SphericalTileValues.CoreDirtTile)

            // Ground Core
            newContext = SphericalLayerGenerator.generateCoreCell(canvas, context,
                SphericalLayerGenerator.GroundCorePercent, SphericalTileValues.CoreGroundTile)

            // Mantle Core
            newContext = SphericalLayerGenerator.generateCoreCell(canvas, context,
                SphericalLayerGenerator.MantleCorePercent, SphericalTileValues.CoreMantleTile)

            // Inner Core
            newContext = SphericalLayerGenerator.generateCoreCell(canvas, context,
                SphericalLayerGenerator.InnerCorePercent, SphericalTileValues.CoreInfernoTile)

            resolve(newContext)
        })
    }

    static async generateCoreCell(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, estatePercent: number, coreGroundTile: SphericalTileColorData): Promise<CanvasRenderingContext2D> {
        return new Promise((resolve, reject) => {
            let clonedImage = new Image()
            clonedImage.src = canvas.toDataURL()
            
            clonedImage.onload = () => {
                const newWidth = (canvas.width * estatePercent) * (coreGroundTile == SphericalTileValues.CoreGrassTile ? 1.05 : 1.02)
                const newHeight = canvas.height * estatePercent
                const x = (canvas.width / 2) - (newWidth / 2)
                const y = (canvas.height / 2) - (newHeight / 2)
                let clonedCanvas = cloneCanvas(canvas)
                let clonedCtx = clonedCanvas.getContext('2d')
                
                clonedCtx = recolorCanvas2DContext(clonedCanvas, clonedCtx, coreGroundTile)
                clonedImage.src = clonedCanvas.toDataURL()

                clonedImage.onload = function() {
                    context.drawImage(clonedImage, x, y, newWidth, newHeight)

                    clonedCanvas = undefined
                    clonedCtx = undefined
                    clonedImage = undefined


                    resolve(context)
                }
            }
        })
    }
}
