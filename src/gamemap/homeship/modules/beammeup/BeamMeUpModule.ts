import { Key } from 'ts-keycode-enum'
import { Assets, AssetUrls } from '../../../../asset/Assets'
import { ClientPlayer, PlayerConsciousnessState } from '../../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../../engine/display/Sprite'
import { Flogger } from '../../../../service/Flogger'
import { HomeshipicalModule, IHomeShipicalModule } from '../HomeshipicalModule'

export interface IBeamMeUpModule extends IHomeShipicalModule {

}

export class BeamMeUpModule extends HomeshipicalModule implements IBeamMeUpModule {
    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.HSM_BEAM_ME_UP))
        const sprite = new Sprite({ texture })

        super({
            sprite,
            xTile: 15,
            interactiveOffsetX: sprite.halfWidth,
            interactKey: Key.E,
            shouldAddTooltip: true,
            onInteract() {
                return new Promise((resolve) => {
                    Flogger.log('BeamMeUpModule', 'onInteract')
                    const player = ClientPlayer.getInstance()

                    this.highlight()

                    player.consciousnessState = PlayerConsciousnessState.Controlled

                    window.setTimeout(() => {
                        Flogger.log('BeamMeUpModule', 'module interaction finished')

                        this.unhighlight()

                        resolve(true)
                    }, 1000)
                })
            },
            onEnter() {
                if (!this.hasBeenInteracted && this.tooltip !== undefined) {
                    this.tooltip.show()
                }
            },
            onExit() {
                if (this.tooltip !== undefined) {
                    this.tooltip.hide()
                }
            }
        })

        
    }
}
