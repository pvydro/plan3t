import { Assets, AssetUrls } from '../../../../asset/Assets'
import { Sprite } from '../../../../engine/display/Sprite'
import { TooltipManager } from '../../../../manager/TooltipManager'
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
            xTile: 15
        })

        TooltipManager.getInstance().addTooltip({
            type: TooltipType.Key,
            text: 'E',
            targetToFollow: this
        })
    }
}
