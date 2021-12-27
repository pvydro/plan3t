import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { TooltipManager } from '../manager/TooltipManager'
import { log } from '../service/Flogger'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { GameState, GameStateOptions, IGameState } from './GameState'
import { Graphix } from '../engine/display/Graphix'
import { Game } from '../main/Game'
import { Defaults } from '../utils/Defaults'
import { camera, entityMan, gameMapMan, inGameHUD, particleMan, toolTipMan } from '../shared/Dependencies'
import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { PlayerSchema } from '../network/schema/PlayerSchema'

export interface ISpaceshipState extends IGameState {

}

export class HomeshipState extends GameState implements ISpaceshipState {
    backgroundGraphics: Graphix
    ambientLight: GameplayAmbientLight

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Homeship
        })

        this.ambientLight = new GameplayAmbientLight()
    }

    async initialize() {
        await this.initializeBackground()
        camera.viewport.addChild(inGameHUD)

        gameMapMan.initializeHomeship().then(async () => {
            log(this.name, 'Homeship initialized')

            const player = ClientPlayer.getInstance({
                clientControl: true
            })
            entityMan.registerEntity('localplayer', player)

            player.light.disableHardLights()
            player.holster.holsterWeapon()
            player.x = 32

            await inGameHUD.initializeHUD()
            inGameHUD.requestCrosshairState(CrosshairState.Cursor)
            
            camera.follow(player)
            camera.stage.addChildAtLayer(player, CameraLayer.Players)
            camera.stage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
            camera.stage.addChildAtLayer(toolTipMan.container, CameraLayer.Tooltips)
            camera.stage.addChildAtLayer(particleMan.container, CameraLayer.Particle)
            camera.stage.addChildAtLayer(particleMan.overlayContainer, CameraLayer.OverlayParticle)

            Game.showLoadingScreen(false, Defaults.LoadingScreenCloseDelay)
            super.initialize()
        })

    }

    update() {
        gameMapMan.update()
        this.ambientLight.update()
        inGameHUD.update()
    }

    async exit() {
        log(this.name, 'exit')

        await Game.showLoadingScreen(true)

        this.ambientLight.demolish()
        await inGameHUD.showHUDComponents(false)

        super.exit()
    }

    initializeBackground() {
        // TODO FIXME Uncomment this to add background to HomeShip state
        // this.backgroundGraphics = new Graphix()
        // this.backgroundGraphics.beginFill(0x8F8F8F)
        // this.backgroundGraphics.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        // this.camera.stage.addChildAtLayer(this.backgroundGraphics, CameraLayer.Background)
    }
}
