import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { InGameTooltip, InGameTooltipOptions } from './InGameTooltip'

export interface KeyTooltipOptions extends InGameTooltipOptions {

}

export interface IKeyTooltip extends InGameTooltip {

}

export class KeyTooltip extends InGameTooltip implements IKeyTooltip {
    constructor(options: KeyTooltipOptions) {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.TOOLTIP_KEY))
        options.backgroundSprite = new Sprite({ texture })

        super(options)

    }

    update() {

    }
}
