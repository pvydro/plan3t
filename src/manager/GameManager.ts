import { Client, Room } from 'colyseus.js'
import * as Viewport from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import { GameState } from '../network/rooms/GameState'
import { ENDPOINT } from '../network/Network'
import { IRoomManager } from './RoomManager'
import { Entity } from '../network/rooms/Entity'

export interface IGameManager {
    initialize(): Promise<void>
    application: PIXI.Application
    viewport: Viewport
}

export interface GameManagerOptions {
    // application: PIXI.Application
}

export class GameManager {
    _application: PIXI.Application

    // ClientManager & RoomManager
    client: Client
    room: Room<GameState>
    roomManager: IRoomManager
    lerp = (a: number, b: number, t: number) => (b - a) * t + a

    // CameraManager
    viewport: Viewport

    constructor(options: GameManagerOptions) {
        // this._application = options.application
    }

    async initialize() {
        // draw boundaries of the world
        const boundaries = new PIXI.Graphics()
        const worldSize = 2000
        boundaries.beginFill(0x000000)
        boundaries.drawRoundedRect(0, 0, worldSize, worldSize, 30)

        // Viewport
        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 2000,
            worldHeight: 2000
        })

        this.viewport.addChild(boundaries)
        
        this._application = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight
        })
        this._application.stage.addChild(this.viewport)

        // Network
        this.client = new Client(ENDPOINT)

        this.room = await this.client.joinOrCreate<GameState>('GameRoom')

        // this.room.state.entities.onAdd = (entity: Entity, sessionId: string) => {
        //     this.roomManager.onAdd(entity, sessionId)
        // }

        return
    }

    loop() {
        const entities = this.roomManager.entities
        for (var id in entities) {
            entities[id].x = this.lerp(entities[id].x, this.room.state.entities[id].x, 0.2)
            entities[id].y = this.lerp(entities[id].y, this.room.state.entities[id].y, 0.2)
        }
    }

    get application(): PIXI.Application {
        return this._application
    }
}