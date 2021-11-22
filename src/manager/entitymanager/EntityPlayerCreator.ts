import * as PIXI from 'pixi.js'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { Environment } from '../../main/Environment'
import { PlayerSchema } from '../../network/schema/PlayerSchema'
import { Flogger } from '../../service/Flogger'
import { camera, matchMaker, userProfile } from '../../shared/Dependencies'
import { EntityCreatorOptions, IEntityManager } from './EntityManager'

export interface IEntityPlayerCreator {
    createPlayer(schema: PlayerSchema): ClientPlayer
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

    createPlayer(schema: PlayerSchema): ClientPlayer {
        Flogger.log('EntityPlayerCreator', 'createPlayer', 'sessionId', schema.id)

        const isClientPlayer = (matchMaker.currentRoom.sessionId === schema.id)
        
        if (isClientPlayer && this._currentClientPlayer) {
            return this._currentClientPlayer
        }
        
        const player = this.getPlayer(schema)

        player.x = schema?.x ?? 0
        player.y = schema?.y ?? 0

        this.entityManager.registerEntity(schema.id, {
            clientEntity: player,
            serverEntity: schema
        })
        
        // Client player camera follow
        if (isClientPlayer) {
            this.markPlayerAsSpawned(schema.id)
            camera.follow(player)
        }

        return player
    }

    private getPlayer(schema: PlayerSchema): ClientPlayer {
        let player
        const isClientPlayer = (matchMaker.currentRoom.sessionId === schema.id)

        if (isClientPlayer) {
            player = ClientPlayer.getInstance({
                schema,
                sessionId: schema.id,
                clientControl: true,
                playerName: userProfile.username
            })
                
            this._currentClientPlayer = player
        } else {
            player = new ClientPlayer({
                schema,
                sessionId: schema.id,
                playerName: schema.id
            })
        }

        camera.stage.addChildAtLayer(player, CameraLayer.Players)

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

    // private isClientPlayer(schema: PlayerSchema) {
    //     return (schema.id == Environment.sessionId)
    // }

    clearRegisteredPlayer() {
        this._currentClientPlayer = undefined
    }
}
