import { Client, Room } from 'colyseus.js'
import { zip } from 'rxjs'
import { ENDPOINT } from '../network/Network'
import { PVPGameRoomState } from '../network/schema/pvpgamestate/PVPGameRoomState'
import { ServerGameState } from '../network/schema/serverstate/ServerGameState'
import { logError } from '../service/Flogger'

export interface IMatchMaker {
    client: Client
    currentRoom: Room<any>
    currentState: ServerGameState
    initializeClient(): void
    createMatch(): void
    joinMatch(matchId: string): void
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
            this.currentRoom = await this.client.create<PVPGameRoomState>('GameRoom')
            this.matchId = this.currentRoom.id
        } catch (error) {
            logError('Error creating match', error)
        }
    }

    async joinMatch(matchId: string) {
        try {
            this.currentRoom = await this.client.joinById(matchId)
            this.matchId = matchId
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