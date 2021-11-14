import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { GameState, GameStateOptions, IGameState } from './GameState'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { Game } from '../main/Game'
import { Defaults } from '../utils/Defaults'
import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { asyncTimeout } from '../utils/Utils'
import { camera, gameMapMan, matchMaker, particleMan } from '../shared/Dependencies'

export interface IGameplayState extends IGameState {
}

export class GameplayState extends GameState implements IGameplayState {
    ambientLight: GameplayAmbientLight
    player: ClientPlayer

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Gameplay
        })

        this.ambientLight = new GameplayAmbientLight()
    }
    
    async initialize() {
        camera.cameraLetterboxPlugin.show()
        camera.stage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
        camera.stage.addChildAtLayer(particleMan.container, CameraLayer.Particle)
        camera.stage.addChildAtLayer(particleMan.overlayContainer, CameraLayer.OverlayParticle)
        camera.viewport.addChild(this.inGameHUD)

        this.inGameHUD.requestCrosshairState(CrosshairState.Gameplay)
        this.inGameHUD.showHUDComponents()
        
        await matchMaker.createMatch()
        await matchMaker.joinMatch(matchMaker.matchId)
        await Game.showLoadingScreen(false, Defaults.LoadingScreenCloseDelay)
        await this.inGameHUD.initializeHUD()
        await asyncTimeout(1000)

        // REF: Do this based on server
        this.player = this.entityManager.createOfflinePlayer()
        camera.stage.addChild(this.player)
        camera.follow(this.player)
    }

    update() {
        gameMapMan.update()
        this.ambientLight.update()
        this.inGameHUD.update()
    }

    demolish() {

    }
}
