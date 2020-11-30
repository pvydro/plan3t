import * as PIXI from 'pixi.js'
import * as Viewport from 'pixi-viewport'
import { WindowSize, WorldSize } from '../utils/Constants'
import { Room, Client } from 'colyseus.js'
import { GameState } from '../network/rooms/GameState'
import { ENDPOINT } from '../network/Network'
import { IRoomManager } from '../manager/RoomManager'
import { IClientManager } from '../manager/ClientManager'
import { IEntityManager } from '../manager/EntityManager'
import { IGameLoop, GameLoop } from '../gameloop/GameLoop'
import { Camera } from '../camera/Camera'

export interface IGame {
    bootstrap(): Promise<void>
    view: any
    cameraViewport: Viewport
    renderer: PIXI.Renderer
}

export interface GameOptions {
    roomManager: IRoomManager
    clientManager: IClientManager
    entityManager: IEntityManager
}

export class Game implements IGame {
    _application: PIXI.Application

    roomManager: IRoomManager
    clientManager: IClientManager

    gameLoop: IGameLoop

    constructor(options: GameOptions) {
        this.roomManager = options.roomManager
        this.clientManager = options.clientManager

        this.instantiateApplication()
    }

    async bootstrap() {
        await this.clientManager.initialize()
        await this.roomManager.initializeRoom()
        
        this.initializeBackground()
        this.initializeMouseMovement()
        this.initializeGameLoop()
        this.initializeCamera()
    }

    instantiateApplication() {
        this._application = new PIXI.Application({
            width: WindowSize.width,
            height: window.innerHeight,
            backgroundColor: 0x0c0c0c
        })
    }
    
    initializeCamera() {
        this.stage.addChild(this.cameraViewport)
    }

    initializeGameLoop() {
        this.gameLoop = new GameLoop({
            entityManager: this.clientManager.entityManager,
            roomManager: this.roomManager
        })

        this.gameLoop.startGameLoop()
    }

    initializeMouseMovement() {
        this.cameraViewport.on('mousemove', (e) => {
            const point = this.cameraViewport.toLocal(e.data.global)
            this.room.send('mouse', { x: point.x, y: point.y })
        })
    }

    initializeBackground() {
        const boundaries = new PIXI.Graphics()
        boundaries.beginFill(0x000000)
        boundaries.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        this.cameraViewport.addChild(boundaries)
    }

    get room() {
        return this.roomManager.currentRoom
    }

    get application(): PIXI.Application {
        return this._application
    }

    get view() {
        return this._application.view
    }

    get cameraViewport() {
        return this.clientManager.clientCamera.viewport
    }

    get renderer() {
        return this._application.renderer
    }

    get stage() {
        return this._application.stage
    }
}