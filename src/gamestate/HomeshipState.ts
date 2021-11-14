import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { TooltipManager } from '../manager/TooltipManager'
import { log } from '../service/Flogger'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { GameState, GameStateOptions, IGameState } from './GameState'
import { Graphix } from '../engine/display/Graphix'
import { Game } from '../main/Game'
import { Defaults } from '../utils/Defaults'
import { camera, entityMan, gameMapMan, particleMan } from '../shared/Dependencies'

export interface ISpaceshipState extends IGameState {

}

export class HomeshipState extends GameState implements ISpaceshipState {
    backgroundGraphics: Graphix
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Homeship
        })

        this.inGameHUD = InGameHUD.getInstance()
        this.ambientLight = new GameplayAmbientLight()
    }

    async initialize() {
        await this.initializeBackground()
        camera.viewport.addChild(this.inGameHUD)

        gameMapMan.initializeHomeship().then(async () => {
            log(this.name, 'Homeship initialized')

            const player = entityMan.createOfflinePlayer()
            const tooltipManager = TooltipManager.getInstance()
            const cameraStage = camera.stage

            player.light.disableHardLights()
            player.holster.holsterWeapon()
            player.x = 32

            await this.inGameHUD.initializeHUD()
            this.inGameHUD.requestCrosshairState(CrosshairState.Cursor)
            
            camera.follow(player)
            cameraStage.addChildAtLayer(player, CameraLayer.Players)
            cameraStage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
            cameraStage.addChildAtLayer(tooltipManager.container, CameraLayer.Tooltips)
            cameraStage.addChildAtLayer(particleMan.container, CameraLayer.Particle)
            cameraStage.addChildAtLayer(particleMan.overlayContainer, CameraLayer.OverlayParticle)

            Game.showLoadingScreen(false, Defaults.LoadingScreenCloseDelay)
            super.initialize()
        })

    }

    update() {
        gameMapMan.update()
        this.ambientLight.update()
        this.inGameHUD.update()
    }

    async exit() {
        log(this.name, 'exit')

        await Game.showLoadingScreen(true)

        this.ambientLight.demolish()
        await this.inGameHUD.showHUDComponents(false)

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
