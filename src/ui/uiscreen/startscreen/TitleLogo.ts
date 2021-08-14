import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../../../engine/display/Sprite'
import { UIComponent, IUIComponent } from '../../UIComponent'

export interface ITitleLogo extends IUIComponent {

}

export class TitleLogo extends UIComponent implements ITitleLogo {
    constructor() {
        super({
            sprite: new Sprite({
                texture: PIXI.Texture.from(Assets.get(AssetUrls.TitleLogoSmall))
            })
        })
    }

    reposition() {

    }
}
