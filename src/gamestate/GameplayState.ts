import { Room } from 'colyseus.js'
import { CameraLayer } from '../camera/CameraStage'
import { Viewport } from '../camera/Viewport'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/GameStateManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { PassiveHornet } from '../creature/passivehornet/PassiveHornet'
import { log } from '../service/Flogger'
import { GameState, GameStateOptions, IGameState } from './GameState'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { Game } from '../main/Game'
import { Defaults } from '../utils/Defaults'
import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { asyncTimeout } from '../utils/Utils'

export interface IGameplayState extends IGameState {
    cameraViewport: Viewport
}

export class GameplayState extends GameState implements IGameplayState {
    ambientLight: GameplayAmbientLight
    hornet: PassiveHornet
    player: ClientPlayer


    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Gameplay
        })

        this.ambientLight = new GameplayAmbientLight()
        this.hornet = new PassiveHornet()
    }
    
    async initialize() {
        const particleManager = ParticleManager.getInstance()
        
        this.inGameHUD.showHUDComponents()

        this.cameraStage.addChildAtLayer(this.hornet, CameraLayer.GameMapOverlay)    
        this.cameraStage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
        this.cameraStage.addChildAtLayer(particleManager.container, CameraLayer.Particle)
        this.cameraStage.addChildAtLayer(particleManager.overlayContainer, CameraLayer.OverlayParticle)
        this.inGameHUD.requestCrosshairState(CrosshairState.Gameplay)
        // this.musicManager.

        // await this.initializeBackground()
        this.camera.viewport.addChild(this.inGameHUD)

        
        this.roomManager.initializeRoom().then(async (room: Room) => {
            log('GameplayState', 'Room initialized')
            
            const mapWidth = this.gameMapManager.gameMap.width// * this.camera.zoom
            const cameraWidth = this.camera.viewport.width * this.camera.zoom

            await Game.showLoadingScreen(false, Defaults.LoadingScreenCloseDelay)
            await this.inGameHUD.initializeHUD()

            await asyncTimeout(1000)

            this.player = this.entityManager.createClientPlayer(undefined, room.id)//this.entityManager.createOfflinePlayer()
            this.cameraStage.addChildAtLayer(this.player, CameraLayer.Players)
            this.camera.follow(this.player)

            // this.player.pos = {
            //     x: 512,
            //     y: -256
            // }
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
