import { Assets, AssetUrls } from '../../../../asset/Assets'
import { Sprite } from '../../../../engine/display/Sprite'
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
    }
}
