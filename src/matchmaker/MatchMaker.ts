import { Client, Room } from 'colyseus.js'
import { ENDPOINT } from '../network/Network'
import { PVPGameRoomState } from '../network/schema/pvpgamestate/PVPGameRoomState'
import { ServerGameState } from '../network/schema/serverstate/ServerGameState'
import { logError } from '../service/Flogger'

export interface IMatchMaker {
    client: Client
    currentRoom: Room<any>
    currentState: ServerGameState
    initializeClient(): void
    createMatch(): Promise<Room<ServerGameState>>
    joinMatch(matchId: string): Promise<Room<ServerGameState>>
    joinOrCreate(): Promise<Room<ServerGameState>>
    leaveMatch(): void
}

export class MatchMaker implements IMatchMaker {
    client: Client
    matchId: string
    currentRoom: Room<any>

    constructor() {
    }

    initializeClient() {
        this.client = new Client(ENDPOINT)
    }

    async createMatch() {
        try {
            this.currentRoom = await this.client.create<PVPGameRoomState>('PVPGameRoom')
            this.matchId = this.currentRoom.id

            return this.currentRoom
        } catch (error) {
            logError('Error creating match', error)
        }
    }

    async joinOrCreate() {
        try {
            this.currentRoom = await this.client.joinOrCreate<PVPGameRoomState>('PVPGameRoom')
            this.matchId = this.currentRoom.id

            return this.currentRoom
        } catch (error) {
            logError('Error in joinOrCreate', error)
        }
    }

    async joinMatch(matchId: string) {
        try {
            this.currentRoom = await this.client.joinById(matchId)
            this.matchId = matchId

            return this.currentRoom
        } catch (error) {
            logError(`Error joining match by ID of ${ matchId }`, error)
        }
    }

    async leaveMatch() {
        // this.client.leave(this.matchId, (err: any, match: any) => {
        //     if (err) {
        //         console.log('Matchmaker error', err)
        //     } else {
        //         this.matchId = null
        //         this.match = null
        //     }
        // }
    }

    get currentState() {
        return this.currentRoom?.state
    }
}