import * as PIXI from 'pixi.js'
import { Key } from 'ts-keycode-enum'
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
        const keyText = options.text.text

        options.backgroundSprite = new Sprite({ texture })
        options.text = {
            text: keyText,
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
