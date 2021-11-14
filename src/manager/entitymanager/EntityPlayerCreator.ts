import * as PIXI from 'pixi.js'
import { Camera } from '../../camera/Camera'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Flogger } from '../../service/Flogger'
import { matchMaker, userProfile } from '../../shared/Dependencies'
import { EntityCreatorOptions, IEntityManager } from './EntityManager'

export interface IEntityPlayerCreator {
    createPlayer(id: string, options: PlayerCreationOptions): ClientPlayer
    clearRegisteredPlayer(): void
}

export interface PlayerCreationOptions extends EntityCreatorOptions {
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

    createPlayer(id: string, options: PlayerCreationOptions): ClientPlayer {
        Flogger.log('EntityPlayerCreator', 'createPlayer', 'sessionId', id, 'isClientPlayer', options.isClientPlayer)

        if (options.isClientPlayer && this._currentClientPlayer) return this._currentClientPlayer

        const player = this.getPlayer(id, options)
        player.x = options?.schema?.x ?? 0
        player.y = options?.schema?.y ?? 0

        this.entityManager.registerEntity(id, {
            clientEntity: player,
            serverEntity: options.schema
        })
        
        // Client player camera follow
        if (options.isClientPlayer) {
            this.markPlayerAsSpawned(id)
        }

        return player
    }

    private getPlayer(id: string, options: PlayerCreationOptions): ClientPlayer {
        let player

        if (options.isClientPlayer) {
            if (this._currentClientPlayer) {
                return this._currentClientPlayer
            } else {
                this._currentClientPlayer = ClientPlayer.getInstance({
                    sessionId: id,
                    clientControl: true,
                    offlineControl: options.isOfflinePlayer ?? false,
                    schema: options.schema,
                    entityManager: this.entityManager,
                    playerName: userProfile.username
                })
                
                player = this._currentClientPlayer
            }
        } else {
            player = new ClientPlayer({
                schema: options.schema,
                playerName: id
            })
        }

        return player
    }
    
    private markPlayerAsSpawned(sessionId: string) {
        Flogger.log('EntityPlayerCreator', 'start markPlayerAsSpawned timer', 'sessionId', sessionId)
        
        setTimeout(() => {
            Flogger.log('EntityPlayerCreator', 'markPlayerAsSpawned', 'sessionId', sessionId)
            const currentState = matchMaker.currentState

            if (currentState) {
                const fetchedPlayer = currentState.players.get(sessionId)
    
                if (fetchedPlayer !== undefined) {
                    fetchedPlayer.hasSpawned = true
                }
            }
        }, 1000)
    }

    clearRegisteredPlayer() {
        this._currentClientPlayer = undefined
    }
}
