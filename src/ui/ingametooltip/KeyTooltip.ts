import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Fonts } from '../../asset/Fonts'
import { Sprite } from '../../engine/display/Sprite'
import { TextSprite, TextSpriteAlign } from '../../engine/display/TextSprite'
import { InGameTooltip, InGameTooltipOptions } from './InGameTooltip'

export interface KeyTooltipOptions extends InGameTooltipOptions {

}

export interface IKeyTooltip extends InGameTooltip {

}

export class KeyTooltip extends InGameTooltip implements IKeyTooltip {
    keyText: TextSprite

    constructor(options: KeyTooltipOptions) {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.TOOLTIP_KEY))
        const opText = options.text
        options.backgroundSprite = new Sprite({ texture })
        options.text = {
            text: opText.text,
            fontSize: 12,
            fontFamily: Fonts.Font.family,
            align: TextSpriteAlign.Center
        }

        super(options)
    }

    update() {
        super.update()
    }
}
