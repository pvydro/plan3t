import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/GameStateManager'
import { TooltipManager } from '../manager/TooltipManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { log } from '../service/Flogger'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { WorldSize } from '../utils/Constants'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface ISpaceshipState extends IGameState {

}

export class HomeshipState extends GameState implements ISpaceshipState {
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD
    // player: 

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

        // To get the camera, you need the game stage, pass Game through StateManager

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

        await this.inGameHUD.hideHUDComponents()

        super.exit()
    }

    initializeBackground() {
        const boundaries = new PIXI.Graphics()
        boundaries.beginFill(0x8F8F8F)
        boundaries.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        this.camera.stage.addChildAtLayer(boundaries, CameraLayer.Background)
    }
}
