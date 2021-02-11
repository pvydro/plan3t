import * as PIXI from 'pixi.js'
import { Camera, ICamera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Entity } from '../../network/rooms/Entity'
import { Flogger } from '../../service/Flogger'
import { IEntityManager } from './EntityManager'

export interface IEntityPlayerCreator {
    createPlayer(options: PlayerCreationOptions): ClientPlayer
}

export interface PlayerCreationOptions {
    entity: Entity
    sessionId: string
    isClientPlayer?: boolean
}

export interface EntityPlayerCreatorOptions {
    entityManager: IEntityManager
}

export class EntityPlayerCreator implements IEntityPlayerCreator {
    currentPlayer: ClientPlayer
    entityManager: IEntityManager

    constructor(options: EntityPlayerCreatorOptions) {
        this.entityManager = options.entityManager
    }

    createPlayer(options: PlayerCreationOptions): ClientPlayer {
        Flogger.log('EntityPlayerCreator', 'createPlayer', 'sessionId', options.sessionId, 'isClientPlayer', options.isClientPlayer)

        const player = this.getPlayer(options)

        this.cameraStage.addChildAtLayer(player, CameraLayer.Players)
        this.entityManager.registerEntity(options.sessionId, {
            clientEntity: player,
            serverEntity: options.entity
        })
        
        // Client player camera follow
        if (options.isClientPlayer === true) {
            this.currentPlayer = player
            
            this.camera.follow(this.currentPlayer as PIXI.DisplayObject)
            
            this.markPlayerAsSpawned(options.sessionId)
        }

        return player
    }

    private getPlayer(options: PlayerCreationOptions): ClientPlayer {
        let player

        if (options.isClientPlayer === true) {
            player = ClientPlayer.getInstance({
                clientControl: true,
                entity: options.entity,
                entityManager: this.entityManager
            })
        } else {
            player = new ClientPlayer({ entity: options.entity })
        }

        return player
    }
    
    private markPlayerAsSpawned(sessionId: string) {
        Flogger.log('EntityPlayerCreator', 'start markPlayerAsSpawned timer', 'sessionId', sessionId)
        
        setTimeout(() => {
            Flogger.log('EntityPlayerCreator', 'markPlayerAsSpawned', 'sessionId', sessionId)
            this.roomState.players.get(sessionId).hasSpawned = true
        }, 1000)
    }

    get roomState() {
        return this.entityManager.roomState
    }

    get camera(): Camera {
        return this.entityManager.camera
    }

    get cameraStage() {
        return this.camera.stage
    }
}
