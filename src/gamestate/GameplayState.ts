import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/gamestatemanager/GameStateManager'
import { GameState, GameStateOptions, IGameState } from './GameState'
import { CrosshairState } from '../ui/ingamehud/crosshair/Crosshair'
import { Game } from '../main/Game'
import { Defaults } from '../utils/Defaults'
import { ClientPlayer } from '../cliententity/clientplayer/ClientPlayer'
import { asyncTimeout } from '../utils/Utils'
import { camera, gameMapMan, inGameHUD, matchMaker, particleMan } from '../shared/Dependencies'
import { RoomMessenger } from '../manager/roommanager/RoomMessenger'
import { RoomMessage } from '../network/rooms/ServerMessages'
import { getURLParameter } from '../utils/URLUtils'
import { InGameScreenID } from '../ui/ingamemenu/InGameMenu'
import { MapBuildingType } from '../network/utils/Enum'
import { log } from '../service/Flogger'

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
        camera.viewport.addChild(inGameHUD)

        inGameHUD.requestCrosshairState(CrosshairState.Gameplay)
        inGameHUD.showHUDComponents()
        
        // await matchMaker.createMatch()
        // await matchMaker.joinMatch(matchMaker.matchId)
        // await matchMaker.joinOrCreate()
        await this.createOrJoin()
        await Game.showLoadingScreen(false, Defaults.LoadingScreenCloseDelay)
        await inGameHUD.initializeHUD()
        await asyncTimeout(1000)
        await RoomMessenger.send(RoomMessage.RequestPlayer, {})

        // TODO: Do this based on server
        gameMapMan.initializeBuilding(MapBuildingType.CloningFacility, 3)
        // this.player = entityMan.createOfflinePlayer()
        // camera.stage.addChildAtLayer(this.player, CameraLayer.Players)
        // camera.follow(this.player)
    }

    async createOrJoin() {
        const roomIdFromUrl = getURLParameter('room')

        log('createOrJoin', 'roomIdFromUrl', roomIdFromUrl)

        if (roomIdFromUrl) {
            await matchMaker.joinMatch(roomIdFromUrl)
        } else {
            await matchMaker.createMatch()
            await matchMaker.joinMatch(matchMaker.matchId)
        }
    }

    update() {
        gameMapMan.update()
        this.ambientLight.update()
    }

    demolish() {

    }

    gameOver() {
        super.gameOver()

        inGameHUD.requestMenuScreen(InGameScreenID.RespawnScreen)
    }
}
