/**
 * https://github.com/kittykatattack/spriteUtilities
 */

import { SpriteUtilities } from '../lib/spriteutilities'

export interface ISpriteUtils {

}

export class SpriteUtils {
    private static utility: SpriteUtilities = new SpriteUtilities()

    private constructor() {

    }

    static getFrameSeries(startIndex: number, endIndex: number, baseName: string, extension: string): any[] {
        return this.utility.frameSeries(startIndex, endIndex, baseName, extension)
    }
}
