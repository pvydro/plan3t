import { Room } from 'colyseus.js'
import { CameraLayer } from '../camera/CameraStage'
import { Viewport } from '../camera/Viewport'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { PassiveHornet } from '../creature/passivehornet/PassiveHornet'
import { log } from '../service/Flogger'
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
        const cameraStage = camera.stage

        camera.cameraLetterboxPlugin.show()
        this.inGameHUD.showHUDComponents()

        cameraStage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
        cameraStage.addChildAtLayer(particleMan.container, CameraLayer.Particle)
        cameraStage.addChildAtLayer(particleMan.overlayContainer, CameraLayer.OverlayParticle)
        this.inGameHUD.requestCrosshairState(CrosshairState.Gameplay)

        camera.viewport.addChild(this.inGameHUD)
        
        await matchMaker.createMatch()
        await matchMaker.joinMatch(matchMaker.matchId)
        await Game.showLoadingScreen(false, Defaults.LoadingScreenCloseDelay)
        await this.inGameHUD.initializeHUD()

        await asyncTimeout(1000)

        // REF: Do this based on server
        this.player = this.entityManager.createClientPlayer(undefined, 'test')//room.id)
        camera.follow(this.player)
    }

    update() {
        gameMapMan.update()
        this.ambientLight.update()
        this.inGameHUD.update()
        // this.hornet.update()
    }

    demolish() {

    }
}
