import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../../../engine/display/Sprite'
import { Flogger } from '../../../service/Flogger'
import { WindowSize } from '../../../utils/Constants'
import { Defaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIScreen } from '../../uiscreens/UIScreen'

export interface IInGameInventory extends IUIComponent {

}

export class InGameInventory extends UIScreen implements IInGameInventory {

    topBarSprite: Sprite
    bottomBarSprite: Sprite

    constructor() {
        super()

        const barTexuture = PIXI.Texture.from(Assets.get(AssetUrls.IGI_TOP))

        this.topBarSprite = new Sprite({ texture: barTexuture })
        this.bottomBarSprite = new Sprite({ texture: barTexuture })
        this.bottomBarSprite.anchor.set(1, 0)
        this.bottomBarSprite.flipX()

        this.addChild(this.topBarSprite)
        this.addChild(this.bottomBarSprite)

        this.reposition(true)
    }

    reposition(addListener: boolean)  {
        super.reposition(addListener)
        this.bottomBarSprite.y = 4 // this.minimumHeight + this.topBarSprite.height
        this.bottomBarSprite.x = 4 // this.bottomBarSprite.width

        const thisX = (WindowSize.width / 2) / Defaults.UIScale
        const thisY = ((WindowSize.height / 2) / Defaults.UIScale)
            -(this.height / 2)

        // this.position.set(thisX, thisY)
    }

    private createInventoryGrid() {
        Flogger.log('InGameInventory', 'createInventoryGrid')

        const totalSlots = 12

        for (var i = 0; i < totalSlots; i++) {
            
        }
    }

    forceHide() {
        this.alpha = 0
    }

    applyScale() {
        const toScale = [ this ]

        super.applyScale(toScale)
    }
}
