import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/GameStateManager'
import { TooltipManager } from '../manager/TooltipManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { log } from '../service/Flogger'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { GameState, GameStateOptions, IGameState } from './GameState'
import { Graphix } from '../engine/display/Graphix'

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
        this.camera.viewport.addChild(this.inGameHUD)

        this.gameMapManager.initializeHomeship().then(async () => {
            log(this.name, 'Homeship initialized')

            const player = this.entityManager.createOfflinePlayer()
            const particleManager = ParticleManager.getInstance()
            const tooltipManager = TooltipManager.getInstance()

            player.light.disableHardLights()
            player.holster.holsterWeapon()

            await this.inGameHUD.initializeHUD()
            this.camera.follow(player)
            this.inGameHUD.requestCrosshairState(CrosshairState.Cursor)

            this.cameraStage.addChildAtLayer(player, CameraLayer.Players)
            this.cameraStage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
            this.cameraStage.addChildAtLayer(tooltipManager.container, CameraLayer.Tooltips)
            this.cameraStage.addChildAtLayer(particleManager.container, CameraLayer.Particle)
            this.cameraStage.addChildAtLayer(particleManager.overlayContainer, CameraLayer.OverlayParticle)

            super.initialize()
        })

    }

    update() {
        this.gameMapManager.update()
        this.ambientLight.update()
        this.inGameHUD.update()
    }

    async exit() {
        log(this.name, 'exit')

        this.ambientLight.demolish()
        await this.inGameHUD.hideHUDComponents()

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
