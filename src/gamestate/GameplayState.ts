import { Room } from 'colyseus.js'
import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { Viewport } from '../camera/Viewport'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { IClientManager } from '../manager/ClientManager'
import { GameMapManager, IGameMapManager } from '../manager/GameMapManager'
import { GameStateID } from '../manager/GameStateManager'
import { GravityManager, IGravityManager } from '../manager/GravityManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { IRoomManager, RoomManager } from '../manager/roommanager/RoomManager'
import { PassiveHornet } from '../creature/passivehornet/PassiveHornet'
import { Flogger } from '../service/Flogger'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { ShowCameraProjectionDebug, WorldSize } from '../utils/Constants'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface IGameplayState extends IGameState {
    cameraViewport: Viewport
}

export class GameplayState extends GameState implements IGameplayState {
    roomManager: IRoomManager
    clientManager: IClientManager
    gameMapManager: IGameMapManager
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD

    hornet: PassiveHornet

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Gameplay
        })

        this.clientManager = this.game.clientManager
        this.gameMapManager = new GameMapManager({
            clientManager: this.clientManager
        })
        this.roomManager = RoomManager.getInstance({
            clientManager: this.clientManager,
            gameMapManager: this.gameMapManager
        })

        this.ambientLight = new GameplayAmbientLight()
        this.inGameHUD = InGameHUD.getInstance()

        this.hornet = new PassiveHornet()

        this.cameraStage.addChildAtLayer(this.hornet, CameraLayer.Players)
    }
    
    async initialize() {
        await this.initializeBackground()
        this.camera.viewport.addChild(this.inGameHUD)

        this.roomManager.initializeRoom().then(async (room: Room) => {
            Flogger.log('GameplayState', 'Room initialized')

            console.log(room.state.planetHasBeenSet)

            await this.inGameHUD.initializeHUD()
    
            // To get the camera, you need the game stage, pass Game through StateManager
            this.stage.addChild(this.cameraViewport)
    
            this.camera.stage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
            this.camera.stage.addChildAtLayer(ParticleManager.getInstance().container, CameraLayer.Particle)
            this.camera.stage.addChildAtLayer(ParticleManager.getInstance().overlayContainer, CameraLayer.OverlayParticle)
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

    initializeBackground() {
        const boundaries = new PIXI.Graphics()
        boundaries.beginFill(0x000000)
        boundaries.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        this.camera.stage.addChildAtLayer(boundaries, CameraLayer.Background)
    }

    get camera() {
        return this.game.camera
    }

    get cameraStage() {
        return this.camera.stage
    }

    get cameraViewport() {
        return this.game.cameraViewport
    }

    get stage() {
        return this.game.stage
    }

    get entityManager() {
        return this.clientManager.entityManager
    }
}
