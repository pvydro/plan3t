/**
 * https://github.com/kittykatattack/spriteUtilities
 */

import { SpriteUtilities } from '../lib/spriteutilities'

export class SpriteUtils {
    private static Utility: SpriteUtilities = new SpriteUtilities()

    private constructor() {}

    static getFrameSeries(startIndex: number, endIndex: number, baseName: string, extension: string): any[] {
        return this.Utility.frameSeries(startIndex, endIndex, baseName, extension)
    }
}
