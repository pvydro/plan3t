import { Camera } from '../camera/Camera'
import { Viewport } from '../camera/Viewport'
import { IClientManager } from '../manager/ClientManager'
import { GameMapManager, IGameMapManager } from '../manager/GameMapManager'
import { GameStateID } from '../manager/GameStateManager'
import { GravityManager, IGravityManager } from '../manager/GravityManager'
import { IRoomManager, RoomManager } from '../manager/RoomManager'
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
    }
    
    async initialize() {
        await this.initializeBackground()
        await this.gameMapManager.initialize()
        await this.roomManager.initializeRoom()

        // To get the camera, you need the game stage, pass Game through StateManager
        this.stage.addChild(this.cameraViewport)

        if (ShowCameraProjectionDebug) Camera.getInstance().initializeDebugger()
    }

    update() {
        
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
