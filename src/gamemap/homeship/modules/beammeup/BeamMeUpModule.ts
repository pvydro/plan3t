import { Key } from 'ts-keycode-enum'
import { Assets, AssetUrls } from '../../../../asset/Assets'
import { Sprite } from '../../../../engine/display/Sprite'
import { GameStateID } from '../../../../manager/gamestatemanager/GameStateManager'
import { Flogger } from '../../../../service/Flogger'
import { gameStateMan } from '../../../../shared/Dependencies'
import { HomeshipicalModule, IHomeShipicalModule } from '../HomeshipicalModule'

export interface IBeamMeUpModule extends IHomeShipicalModule {

}

export class BeamMeUpModule extends HomeshipicalModule implements IBeamMeUpModule {
    didInteract: boolean

    constructor() {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.HomeshipModuleBeamMeUp))
        const sprite = new Sprite({ texture })

        super({
            sprite,
            xTile: 15,
            interactiveOffsetX: sprite.halfWidth,
            interactKey: Key.E,
            shouldAddTooltip: true,
            onInteract: () => {
                gameStateMan.enterState(GameStateID.WaveRunnerGame)

                // if (this.didInteract) return

                // return new Promise((resolve) => {
                //     Flogger.log('BeamMeUpModule', 'onInteract')
                //     const player = ClientPlayer.getInstance()
                //     const self = this
                    
                //     this.didInteract = true
                //     this.highlight()
                //     this.requestBeamMeUpScreen()

                //     player.consciousnessState = PlayerConsciousnessState.Controlled

                //     window.setTimeout(() => {
                //         Flogger.log('BeamMeUpModule', 'module interaction finished')

                //         self.didInteract = false
                //         self.unhighlight()

                //         resolve(true)
                //     }, 1000)
                // })
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

    requestBeamMeUpScreen() {
        Flogger.log('BeamMeUpModule', 'requestBeamMeUpScreen')
        // const hud = InGameHUD.getInstance()

        // if (hud) {
        // InGameHUD.requestScreen(InGameScreenID.BeamMeUp)
        // } else {
        //     Flogger.error('No hud available')
        // }
    }
}
