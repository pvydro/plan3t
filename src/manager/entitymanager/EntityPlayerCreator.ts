import * as PIXI from 'pixi.js'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Entity } from '../../network/rooms/Entity'
import { Flogger } from '../../service/Flogger'
import { IEntityManager } from './EntityManager'

export interface IEntityPlayerCreator {
    createPlayer(options: PlayerCreationOptions): ClientPlayer
    clearRegisteredPlayer(): void
}

export interface PlayerCreationOptions {
    entity?: Entity
    sessionId?: string
    isClientPlayer?: boolean
    isOfflinePlayer?: boolean
}

export interface EntityPlayerCreatorOptions {
    entityManager: IEntityManager
}

export class EntityPlayerCreator implements IEntityPlayerCreator {
    _currentClientPlayer?: ClientPlayer
    entityManager: IEntityManager

    constructor(options: EntityPlayerCreatorOptions) {
        this.entityManager = options.entityManager
    }

    createPlayer(options: PlayerCreationOptions): ClientPlayer {
        const sessionId = options.sessionId ?? 'localplayer'
        Flogger.log('EntityPlayerCreator', 'createPlayer', 'sessionId', sessionId, 'isClientPlayer', options.isClientPlayer)

        if (options.isClientPlayer && this._currentClientPlayer) {
            return this._currentClientPlayer
        }

        const player = this.getPlayer(options)
        this.entityManager.registerEntity(sessionId, {
            clientEntity: player,
            serverEntity: options.entity
        })
        
        // Client player camera follow
        if (options.isClientPlayer) {
            // this.camera.follow(this._currentClientPlayer as PIXI.DisplayObject)
            this.markPlayerAsSpawned(sessionId)
        }

        return player
    }

    private getPlayer(options: PlayerCreationOptions): ClientPlayer {
        let player

        if (options.isClientPlayer) {
            if (this._currentClientPlayer) {
                return this._currentClientPlayer
            } else {
                this._currentClientPlayer = ClientPlayer.getInstance({
                    clientControl: true,
                    offlineControl: options.isOfflinePlayer ?? false,
                    entity: options.entity,
                    entityManager: this.entityManager,
                    sessionId: options.sessionId
                })
                player = this._currentClientPlayer
            }
        } else {
            player = new ClientPlayer({ entity: options.entity })
        }

        return player
    }
    
    private markPlayerAsSpawned(sessionId: string) {
        Flogger.log('EntityPlayerCreator', 'start markPlayerAsSpawned timer', 'sessionId', sessionId)
        
        setTimeout(() => {
            Flogger.log('EntityPlayerCreator', 'markPlayerAsSpawned', 'sessionId', sessionId)

            if (this.roomState !== undefined) {
                const fetchedPlayer = this.roomState.players.get(sessionId)
    
                if (fetchedPlayer !== undefined) {
                    fetchedPlayer.hasSpawned = true
                }
            }
        }, 1000)
    }

    clearRegisteredPlayer() {
        this._currentClientPlayer = undefined
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
