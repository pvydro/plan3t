import { Room } from 'colyseus.js'
import { CameraLayer } from '../camera/CameraStage'
import { Viewport } from '../camera/Viewport'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/GameStateManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { PassiveHornet } from '../creature/passivehornet/PassiveHornet'
import { log } from '../service/Flogger'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { GameState, GameStateOptions, IGameState } from './GameState'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { Game } from '../main/Game'
import { Defaults } from '../utils/Defaults'
import { asyncTimeout } from '../utils/Utils'

export interface IGameplayState extends IGameState {
    cameraViewport: Viewport
}

export class GameplayState extends GameState implements IGameplayState {
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD
    hornet: PassiveHornet

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Gameplay
        })

        this.ambientLight = new GameplayAmbientLight()
        this.hornet = new PassiveHornet()
        this.inGameHUD = InGameHUD.getInstance()
    }
    
    async initialize() {
        const particleManager = ParticleManager.getInstance()
        const player = this.entityManager.createOfflinePlayer()

        this.camera.follow(player)
        this.inGameHUD.showHUDComponents()

        this.cameraStage.addChildAtLayer(player, CameraLayer.Players)
        this.cameraStage.addChildAtLayer(this.hornet, CameraLayer.GameMapOverlay)    
        this.cameraStage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
        this.cameraStage.addChildAtLayer(particleManager.container, CameraLayer.Particle)
        this.cameraStage.addChildAtLayer(particleManager.overlayContainer, CameraLayer.OverlayParticle)
        await asyncTimeout(1500)
        this.inGameHUD.requestCrosshairState(CrosshairState.Gameplay)

        // await this.initializeBackground()
        this.camera.viewport.addChild(this.inGameHUD)

        this.roomManager.initializeRoom().then(async (room: Room) => {
            log('GameplayState', 'Room initialized')

            player.pos = {
                x: 512,
                y: -256
            }

            await Game.showLoadingScreen(false, Defaults.LoadingScreenCloseDelay)
            await this.inGameHUD.initializeHUD()
        })
    }

    update() {
        this.gameMapManager.update()
        this.ambientLight.update()
        this.inGameHUD.update()
        this.hornet.update()
    }

    demolish() {

    }
}
