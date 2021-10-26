import { Client } from 'colyseus'
import { log } from '../../service/Flogger'
import { GameRoom } from '../rooms/GameRoom'
import { PlanetRoom } from '../rooms/planetroom/PlanetRoom'
import { ClientMessage } from '../rooms/ServerMessages'

export interface IWaveRunnerWorker {
    startWaveRunner(client: Client): void
}

export class WaveRunnerWorker implements IWaveRunnerWorker {
    room: GameRoom
    currentWave: number = 0

    constructor(room: GameRoom) {
        this.room = room
    }

    startWaveRunner(client: Client) {
        log('WaveRunnerWorker', 'startWaveRunner')

        setTimeout(() => {
            this.room.send(client, ClientMessage.WaveRunnerStarted, {})
        }, 1000)
    }
}
