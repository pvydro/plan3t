import { Key } from 'ts-keycode-enum'
import { Assets, AssetUrls } from '../../../../asset/Assets'
import { Sprite } from '../../../../engine/display/Sprite'
import { TooltipManager } from '../../../../manager/TooltipManager'
import { Flogger } from '../../../../service/Flogger'
import { TooltipType } from '../../../../ui/ingametooltip/InGameTooltip'
import { HomeshipicalModule, IHomeShipicalModule } from '../HomeshipicalModule'

export interface IBeamMeUp extends IHomeShipicalModule {

}

export class BeamMeUp extends HomeshipicalModule implements IBeamMeUp {
    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.HSM_BEAM_ME_UP))
        const sprite = new Sprite({ texture })
        super({
            sprite,
            xTile: 15,
            interactiveOffsetX: sprite.halfWidth,
            interactKey: Key.E,
            onInteract() {
                Flogger.log('BeamMeUp', 'onInteract')
                
                return new Promise((resolve) => {
                    window.setTimeout(() => {
                        Flogger.log('BeamMeUp', 'interaction finished')

                        resolve(true)
                    }, 1000)
                })
            }
        })

        TooltipManager.getInstance().addTooltip({
            type: TooltipType.Key,
            text: { text: 'E' },
            hideByDefault: true,
            targetToFollow: {
                target: this,
                center: true
            },
        })
    }
}
