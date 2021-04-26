import { IVector2 } from '../../../engine/math/Vector2'
import { ImageUtils } from '../../../utils/ImageUtils'
import { SphericalHelper } from '../SphericalHelper'

export interface ISphericalTileTextureCache {

}

export class SphericalTileTextureCache {
    private static SheetMap: Map<string, HTMLImageElement> = new Map()
    private static TileMap: Map<string, any> = new Map()

    private constructor() {}

    static async getSheet(key: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (this.SheetMap.has(key)) {
                return resolve(this.SheetMap.get(key))
            } else {
                const image = new Image()

                image.src = key + '.png'
                image.onload = () => {
                    this.SheetMap.set(key, image)

                    resolve(image)
                }

                image.onerror = function(error) {
                    reject(error)
                }
            }
        })
    }

    static async getTile(tilesheetUrl: string, coords: IVector2) {
        return new Promise((resolve, reject) => {
            const key: string = tilesheetUrl + coords.x + coords.y

            if (this.TileMap.has(key)) {
                return resolve(this.TileMap.get(key))
            } else {
                const tileSize = SphericalHelper.getTileSize()
                const scissors = ImageUtils.Manipulator

                SphericalTileTextureCache.getSheet(tilesheetUrl).then((image) => {
                    scissors(image).crop(
                        coords.x * tileSize,
                        coords.y * tileSize,
                        tileSize, tileSize
                    ).toDataURL((dataURL) => {
                        this.TileMap.set(key, dataURL)
            
                        resolve(dataURL)
                    })
                })
            }
        })
    }
}
