import { GameMap } from "../gamemap/GameMap";
import { LoggingService } from "../service/LoggingService";
import { IClientManager } from "./ClientManager";

export interface IGameMapManager {
    initialize()
}

export interface GameMapManagerOptions {
    clientManager: IClientManager
}

export class GameMapManager implements IGameMapManager {
    clientManager: IClientManager
    gameMap?: GameMap

    constructor(options: GameMapManagerOptions) {
        this.clientManager = options.clientManager
    }

    async initialize() {
        LoggingService.log('GameMapManager', 'initializeGameMap')

        if (this.gameMap !== undefined) {
            this.gameMap.demolish()
        }

        this.gameMap = new GameMap()
        this.gameMap.initializeSpherical()

        this.viewport.addChild(this.gameMap)
    }

    get viewport() {
        return this.camera.viewport
    }

    get camera() {
        return this.clientManager.clientCamera
    }
}
