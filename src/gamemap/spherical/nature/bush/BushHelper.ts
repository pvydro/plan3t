import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../../asset/Assets'
import { BushType } from './Bush'

export class BushHelper {
    private constructor() {}

    static getTextureForBushType(type: BushType): PIXI.Texture {
        switch (type) {
            case BushType.TicBerry:
                return PIXI.Texture.from(Assets.get(AssetUrls.BushTicberry))
                break
        }
    }
}
