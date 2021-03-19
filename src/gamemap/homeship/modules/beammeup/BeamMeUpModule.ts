import { Key } from 'ts-keycode-enum'
import { Assets, AssetUrls } from '../../../../asset/Assets'
import { ClientPlayer, PlayerConsciousnessState } from '../../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../../engine/display/Sprite'
import { Flogger } from '../../../../service/Flogger'
import { InGameHUD } from '../../../../ui/ingamehud/InGameHUD'
import { InGameScreenID } from '../../../../ui/ingamemenu/InGameMenu'
import { HomeshipicalModule, IHomeShipicalModule } from '../HomeshipicalModule'

export interface IBeamMeUpModule extends IHomeShipicalModule {

}

export class BeamMeUpModule extends HomeshipicalModule implements IBeamMeUpModule {
    didInteract: boolean

    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.HSM_BEAM_ME_UP))
        const sprite = new Sprite({ texture })
        // let hud = InGameHUD.getInstance()

        super({
            sprite,
            xTile: 15,
            interactiveOffsetX: sprite.halfWidth,
            interactKey: Key.E,
            shouldAddTooltip: true,
            onInteract() {
                if (this.didInteract) return

                return new Promise((resolve) => {
                    Flogger.log('BeamMeUpModule', 'onInteract')
                    const player = ClientPlayer.getInstance()
                    
                    this.didInteract = true
                    this.highlight()

                    // if (hud) {
                    //     hud.requestScreen(InGameScreenID.BeamMeUp)
                    // } else {
                    //     // hud = InGameHUD.getInstance()
                    //     // hud.requestScreen(InGameScreenID.BeamMeUp)
                    // }

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
