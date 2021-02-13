import { exists } from '../../../utils/Utils'
import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { PlayerBodyState, PlayerLegsState } from '../../utils/Enum'
import { PlayerPayload, RoomMessage, WeaponStatusPayload } from '../ServerMessages'
import { PlanetRoomListener } from './PlanetRoomListener'
import { Player } from '../Player'

export interface IPlanetRoomPlayerListener {

}

export class PlanetRoomPlayerListener implements IPlanetRoomPlayerListener {
    parentListener: PlanetRoomListener

    constructor(listener: PlanetRoomListener) {
        this.parentListener = listener
    }

    startListening() {
        Flogger.log('PlanetRoomPlayerListener', 'startListening')

        this.listenForWeaponStatusChanges()
        this.listenForBodyStateChange()
        this.listenForLegsStateChange()
        this.listenForDirectionChange()
        this.listenForOnGroundChange()
    }

    private listenForWeaponStatusChanges() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForRotationChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerLookAngleChanged, (client: Client, message: WeaponStatusPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerLookAngleChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyWeaponStatusToPlayer(client.sessionId, message)
        })
    }

    private listenForBodyStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForBodyStateChange')
        
        this.parentListener.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerBodyStateChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForLegsStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForLegsStateChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerBodyStateChanged, 'sessionId', client.sessionId, 'message', message)

            const player = this.getPlayer(client.sessionId)

            if (message.legsState == PlayerLegsState.Jumping && player.legsState !== message.legsState) {
                player.jump()
            }

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForDirectionChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForDirectionChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerDirectionChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerDirectionChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForOnGroundChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForOnGroundChange')

        this.parentListener.room.onMessage(RoomMessage.PlayerLandedOnGround, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerLandedOnGround, 'sessionId', client.sessionId, 'message', message)

            const state = this.parentListener.room.state
            const player = state.players.get(client.sessionId)

            if (message.isOnGround) {
                player.isOnGround = true
                player.yVel = 0
                player.y = message.y
            }
            
            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    applyPlayerPayloadToPlayer(sessionId: string, payload: PlayerPayload) {
        const player = this.getPlayer(sessionId)

        this.applyBodyStatePropertiesToPlayer(payload, player)
        this.applyVelocityPropertiesToPlayer(payload, player)

        // player.x = payload.x ?? player.x
        // player.bodyState = payload.bodyState
        player.legsState = payload.legsState
        player.direction = payload.direction
        player.walkingDirection = payload.walkingDirection

        // Rule based properties
        if (payload.y !== undefined) player.y = payload.y
    }

    applyWeaponStatusToPlayer(sessionId: string, payload: WeaponStatusPayload) {
        const player = this.getPlayer(sessionId)

        player.weaponStatus.rotation = payload.rotation
    }

    // TODO Do this when land on ground
    private applyBodyStatePropertiesToPlayer(payload: PlayerPayload, player: Player) {        
        if (player.bodyState !== PlayerBodyState.Idle) {
            if (payload.bodyState === PlayerBodyState.Idle) {
                // First stand payload
                if (exists(payload.x)) {
                    player.x = payload.x
                }
            }
        }

        player.bodyState = payload.bodyState
    }

    private applyVelocityPropertiesToPlayer(payload: PlayerPayload, player: Player) {
        if (exists(payload.xVel)) {
            if (payload.xVel === 0 && exists(payload.x)) {
                player.x = payload.x
            }
        }
    }

    getPlayer(sessionId: string) {
        const state = this.parentListener.room.state
        const player = state.players.get(sessionId)

        return player
    }
}
