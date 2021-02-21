import * as PIXI from 'pixi.js'
import { AssetUrls } from '../../../../asset/Assets'
import { BushType } from './Bush'

export class BushHelper {
    private constructor() {}

    static getTextureForBushType(type: BushType): PIXI.Texture {
        let textureUrl = AssetUrls.BUSH_TICBERRY

        switch (type) {
            case BushType.TicBerry:
                textureUrl = AssetUrls.BUSH_TICBERRY
                break
        }

        return PIXI.Texture.from(textureUrl)
    }
}
