import { Client } from 'colyseus.js'
import { ENDPOINT } from '../network/Network'

export interface IMatchMaker {
    client: Client
    initializeClient(): void
    createMatch(): void
    joinMatch(matchId: string): void
    leaveMatch(): void
}

export class MatchMaker implements IMatchMaker {
    public client: Client
    private matchId: string
    private match: any

    constructor() {
    }

    public initializeClient() {
        this.client = new Client(ENDPOINT)
        // this.client.onOpen.add(() => console.log('Connected to matchmaker'))
        // this.client.onError.add((error: any) => console.log('Matchmaker error', error))
        // this.client.onClose.add(() => console.log('Matchmaker disconnected'))
    }

    public createMatch() {
        // this.client.create('match', {}, (err: any, match: any) => {
        //     if (err) {
        //         console.log('Matchmaker error', err)
        //     } else {
        //         this.matchId = match.id
        //         this.onMatchCreated(this.matchId)
        //     }
        // })
    }

    public joinMatch(matchId: string) {
        // this.client.joinById(matchId, (err: any, match: any) => {
        //     if (err) {
        //         console.log('Matchmaker error', err)
        //     } else {
        //         this.matchId = match.id
        //         this.match = match
        //         this.onMatchJoined(this.matchId)
        //     }
        // })
    }

    public leaveMatch() {
        // this.client.leave(this.matchId, (err: any, match: any) => {
        //     if (err) {
        //         console.log('Matchmaker error', err)
        //     } else {
        //         this.matchId = null
        //         this.match = null
        //     }
        // }
    }

}