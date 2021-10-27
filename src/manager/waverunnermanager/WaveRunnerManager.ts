import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'
import { IWaveSchema } from '../../network/schema/waverunnergamestate/WaveSchema'
import { importantLog, log } from '../../service/Flogger'
import { IInGameHUD, InGameHUD } from '../../ui/ingamehud/InGameHUD'
import { IWave, Wave } from '../../waverunner/Wave'
import { IRoomManager, RoomManager } from '../roommanager/RoomManager'
import { SpawnPointManager } from '../spawnpointmanager/SpawnPointManager'

export interface IWaveRunnerManager {
    registerWave(schema: IWaveSchema): void
    currentWaveIndex: number
}

export class WaveRunnerManager implements IWaveRunnerManager {
    private static Instance: IWaveRunnerManager
    roomManager: IRoomManager
    currentWaveIndex: number
    currentWave: IWave
    hud: IInGameHUD

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new WaveRunnerManager()
        }

        return this.Instance
    }

    private constructor() {
        this.hud = InGameHUD.getInstance()
        this.roomManager = RoomManager.getInstance()
    }

    registerWave(schema: IWaveSchema) {
        log('WaveRunnerManager', 'registerWave', 'schema', schema)

        this.currentWaveIndex = schema.waveIndex
        this.currentWave = new Wave(schema)
        
        this.hud.loadWave(this.currentWave)
    }

    // async registerCurrentWave() {
    //     log('WaveRunnerManager', 'registerNextWave', 'prevWave', this.currentWaveIndex)

    //     // await this.levelManager.transitionToNewLevel()

    //     // if (this.currentWaveIndex === 0) {
    //     //     await SpawnPointManager.applySpawnPointsToPlayers()
    //     // }

    //     // this.currentWaveIndex++
    //     // this.currentWaveRunnerGame.loadWave(new Wave({
    //     //     waveIndex: this.currentWaveIndex,
    //     //     totalTime: 3000,
    //     //     elapsedTime: 0,
    //     //     onSpawn: () => {
    //     //         this.currentWaveRunnerGame.spawner.spawn()
    //     //     },
    //     //     onComplete: () => {
    //     //         this.registerCurrentWave()
    //     //     }
    //     // }))
    //     // this.hud.loadWave(this.currentWave)

    //     return this.currentWave
    // }
}
