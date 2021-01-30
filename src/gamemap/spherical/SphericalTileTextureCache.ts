import { IVector2 } from '../../engine/math/Vector2'
import { ImageUtils } from '../../utils/ImageUtils'
import { SphericalHelper } from './SphericalHelper'

export interface ISphericalTileTextureCache {

}

export class SphericalTileTextureCache {
    private static sheetMap: Map<string, HTMLImageElement> = new Map()
    private static tileMap: Map<string, any> = new Map()

    private constructor() {}

    static async getSheet(key: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (this.sheetMap.has(key)) {
                console.log('cached sheet!')
                return resolve(this.sheetMap.get(key))
            } else {
                console.log('new sheet!')
                const image = new Image()

                image.src = key + '.png'
                image.onload = () => {
                    this.sheetMap.set(key, image)

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

            if (this.tileMap.has(key)) {
                return resolve(this.tileMap.get(key))
            } else {
                const tileSize = SphericalHelper.getTileSize()
                const scissors = ImageUtils.Manipulator

                SphericalTileTextureCache.getSheet(tilesheetUrl).then((image) => {
                    scissors(image).crop(
                        coords.x * tileSize,
                        coords.y * tileSize,
                        tileSize, tileSize
                    ).toDataURL((dataURL) => {
                        this.tileMap.set(key, dataURL)
            
                        resolve(dataURL)
                    })
                })
            }
        })
    }
}
