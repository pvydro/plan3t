import { Camera } from '../camera/Camera'
import { Viewport } from '../camera/Viewport'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { IClientManager } from '../manager/ClientManager'
import { GameMapManager, IGameMapManager } from '../manager/GameMapManager'
import { GameStateID } from '../manager/GameStateManager'
import { GravityManager, IGravityManager } from '../manager/GravityManager'
import { ParticleManager } from '../manager/ParticleManager'
import { IRoomManager, RoomManager } from '../manager/RoomManager'
import { Crosshair } from '../ui/hud/Crosshair'
import { ShowCameraProjectionDebug, WorldSize } from '../utils/Constants'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface IGameplayState extends IGameState {
    cameraViewport: Viewport
}

export class GameplayState extends GameState implements IGameplayState {
    roomManager: IRoomManager
    clientManager: IClientManager
    gameMapManager: IGameMapManager
    gravityManager: IGravityManager
    ambientLight: GameplayAmbientLight
    crosshair: Crosshair

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Gameplay
        })

        this.clientManager = this.game.clientManager
        this.gravityManager = GravityManager.getInstance()
        this.gameMapManager = new GameMapManager({
            clientManager: this.clientManager
        })
        this.roomManager = new RoomManager({
            clientManager: this.clientManager
        })

        this.ambientLight = new GameplayAmbientLight()
        this.crosshair = Crosshair.getInstance()
    }
    
    async initialize() {
        await this.initializeBackground()
        await this.gameMapManager.initialize()

        // To get the camera, you need the game stage, pass Game through StateManager
        this.stage.addChild(this.cameraViewport)

        if (ShowCameraProjectionDebug) Camera.getInstance().initializeDebugger()

        this.camera.stage.addChild(this.ambientLight)
        this.camera.stage.addChild(ParticleManager.getInstance().container)

        await this.roomManager.initializeRoom()

        this.camera.viewport.addChild(this.crosshair)
    }

    update() {
        this.gameMapManager.update()
        this.ambientLight.update()
        this.crosshair.update()
    }

    demolish() {

    }

    initializeBackground() {
        const boundaries = new PIXI.Graphics()
        boundaries.beginFill(0x000000)
        boundaries.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        this.camera.stage.addChild(boundaries)
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
