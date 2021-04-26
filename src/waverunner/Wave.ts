import { log } from "../service/Flogger"

export interface IWave {
    enemies: number
    startSpawnIntervals()
}

export class Wave implements IWave {
    enemies: number = 10
    spawnInervalTime: number = 5000

    constructor() {

    }

    startSpawnIntervals() {
        log('Wave', 'startSpawnIntervals')

        setInterval(() => {
            this.spawnEnemy()
        }, this.spawnInervalTime)
    }

    spawnEnemy() {
        log('Wave', 'spawnEnemy')
    }
}
