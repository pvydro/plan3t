import { exists } from '../../../utils/Utils'
import { Client } from 'colyseus'
import { Flogger } from '../../../service/Flogger'
import { PlayerBodyState, PlayerLegsState } from '../../utils/Enum'
import { PlayerPayload, RoomMessage, WeaponStatusPayload } from '../ServerMessages'
import { PlanetRoomListener } from './PlanetRoomListener'
import { PlayerSchema } from '../../schema/PlayerSchema'
import { ProjectileSchema } from '../../schema/ProjectileSchema'
import { of, bindCallback, Observable, map } from 'rxjs'

export interface IPlanetRoomPlayerListener {

}

export class PlanetRoomPlayerListener implements IPlanetRoomPlayerListener {
    parentListener: PlanetRoomListener
    playerState$?: Observable<any>

    constructor(listener: PlanetRoomListener) {
        this.parentListener = listener

        // this.playerState$ = bindCallback(this.room.onMessage).pipe(
        //     map(x => x)
        // )
        //Observable) //of(this.room.onMessage)
    }

    startListening() {
        Flogger.log('PlanetRoomPlayerListener', 'startListening')

        // this.listenForWeaponStatusChanges()
        // this.listenForWeaponShots()
        this.listenForBodyStateChange()
        this.listenForLegsStateChange()
        this.listenForDirectionChange()
        this.listenForOnGroundChange()
        this.listenForForceSetPosition()
    }

    private listenForWeaponStatusChanges() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForWeaponStatusChanges')

        this.room.onMessage(RoomMessage.PlayerLookAngleChanged, (client: Client, message: WeaponStatusPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerLookAngleChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyWeaponStatusToPlayer(client.sessionId, message)
        })
    }

    private listenForWeaponShots() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForWeaponShots')

        this.room.onMessage(RoomMessage.PlayerShoot, (client: Client, message: WeaponStatusPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerShoot, 'sessionId', client.sessionId, 'message', message)

            this.triggerWeaponShot(client.sessionId, message)
        })
    }

    private listenForBodyStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForBodyStateChange')
        
        this.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerBodyStateChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForLegsStateChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForLegsStateChange')

        this.room.onMessage(RoomMessage.PlayerBodyStateChanged, (client: Client, message: PlayerPayload) => {
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

        this.room.onMessage(RoomMessage.PlayerDirectionChanged, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerDirectionChanged, 'sessionId', client.sessionId, 'message', message)

            this.applyPlayerPayloadToPlayer(client.sessionId, message)
        })
    }

    private listenForOnGroundChange() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForOnGroundChange')

        this.room.onMessage(RoomMessage.PlayerLandedOnGround, (client: Client, message: PlayerPayload) => {
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

    private listenForForceSetPosition() {
        Flogger.log('PlanetRoomPlayerListener', 'listenForForceSetPosition')

        this.room.onMessage(RoomMessage.PlayerForceSetPosition, (client: Client, message: PlayerPayload) => {
            Flogger.log('PlanetRoomPlayerListener', RoomMessage.PlayerForceSetPosition, 'sessionId', client.sessionId, 'message', message)

            const player = this.getPlayer(client.sessionId)

            player.x = message.x
            player.y = message.y
        })
    }

    applyPlayerPayloadToPlayer(sessionId: string, payload: PlayerPayload) {
        const player = this.getPlayer(sessionId)

        this.applyBodyStatePropertiesToPlayer(payload, player)
        this.applyVelocityPropertiesToPlayer(payload, player)

        // player.x = payload.x ?? player.x
        // player.bodyState = payload.bodyState
        player.weaponStatus.name = payload.weaponName
        player.legsState = payload.legsState
        player.direction = payload.direction
        player.walkingDirection = payload.walkingDirection

        // Rule based properties
        if (payload.y !== undefined) player.y = payload.y
    }

    applyWeaponStatusToPlayer(sessionId: string, payload: WeaponStatusPayload) {
        Flogger.log('PlanetRoomPlayerListener', 'applyWeaponStatusToPlayer', 'payload', payload)

        const player = this.getPlayer(sessionId)

        player.weaponStatus.rotation = payload.rotation
        player.weaponStatus.name = payload.name
    }

    triggerWeaponShot(sessionId: string, payload: WeaponStatusPayload) {
        const bulletVelocity = payload.bulletVelocity ?? 1
        this.room.state.createProjectile(new ProjectileSchema({
            x: payload.bulletX,
            y: payload.bulletY,
            rotation: payload.rotation,
            velocity: bulletVelocity * payload.direction,
            sessionId: sessionId
        }))
    }

    // TODO Do this when land on ground
    private applyBodyStatePropertiesToPlayer(payload: PlayerPayload, player: PlayerSchema) {        
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

    private applyVelocityPropertiesToPlayer(payload: PlayerPayload, player: PlayerSchema) {
        if (exists(payload.xVel)) {
            if (payload.xVel === 0 && exists(payload.x)) {
                player.x = payload.x
            }
        }
    }

    getPlayer(sessionId: string) {
        const player = this.state.players.get(sessionId)

        return player
    }

    get room() {
        return this.parentListener.room
    }

    get state() {
        return this.room.state
    }
}
