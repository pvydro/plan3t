import { Client, Room } from 'colyseus.js'
import { ENDPOINT } from '../network/Network'
import { PVPGameRoomState } from '../network/schema/pvpgamestate/PVPGameRoomState'
import { ServerGameState } from '../network/schema/serverstate/ServerGameState'
import { logError } from '../service/Flogger'

export interface IMatchMaker {
    client: Client
    currentState: ServerGameState
    currentRoom?: Room<any>
    matchId?: string
    initializeClient(): void
    createMatch(): Promise<Room<ServerGameState>>
    joinMatch(matchId: string): Promise<Room<ServerGameState>>
    joinOrCreate(): Promise<Room<ServerGameState>>
    leaveMatch(): void
}

export class MatchMaker implements IMatchMaker {
    client: Client
    matchId?: string
    currentRoom?: Room<any>

    constructor() {
    }

    initializeClient() {
        if (this.client !== undefined) return
        this.client = new Client(ENDPOINT)
    }

    async createMatch() {
        try {
            this.initializeClient()
            this.currentRoom = await this.client.create<PVPGameRoomState>('PVPGameRoom')
            this.matchId = this.currentRoom.id

            return this.currentRoom
        } catch (error) {
            logError('Error creating match', error)
            throw error
        }
    }

    async joinOrCreate() {
        try {
            this.initializeClient()
            this.currentRoom = await this.client.joinOrCreate<PVPGameRoomState>('PVPGameRoom')
            this.matchId = this.currentRoom.id

            return this.currentRoom
        } catch (error) {
            logError('Error in joinOrCreate', error)
            throw error
        }
    }

    async joinMatch(matchId: string) {
        try {
            this.initializeClient()
            this.currentRoom = await this.client.joinById(matchId)
            this.matchId = matchId

            return this.currentRoom
        } catch (error) {
            logError(`Error joining match by ID of ${ matchId }`, error)
            throw error
        }
    }

    async leaveMatch() {
        try {
            this.currentRoom.leave(true)
            this.matchId = undefined
        } catch (error) {
            logError('Error leaving match', error)
            throw error
        }
    }

    get currentState() {
        return this.currentRoom?.state
    }
}