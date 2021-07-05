import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'
import { WaveRunnerSchema, WaveSchema } from '../../network/schema/waverunner/WaveRunnerSchema'
import { importantLog, log } from '../../service/Flogger'
import { IInGameHUD, InGameHUD } from '../../ui/ingamehud/InGameHUD'
import { IWave, Wave } from '../../waverunner/Wave'
import { IWaveRunnerGame, WaveRunnerGame } from '../../waverunner/WaveRunnerGame'
import { IRoomManager, RoomManager } from '../roommanager/RoomManager'
import { SpawnPointManager } from '../spawnpointmanager/SpawnPointManager'
import { IWaveLevelManager, WaveLevelManager } from './WaveLevelManager'

export interface IWaveRunnerManager extends IUpdatable {
    initialize(): Promise<void>
    registerOfflineWave(): Promise<IWave>
}

export class WaveRunnerManager implements IWaveRunnerManager {
    private static Instance: IWaveRunnerManager
    roomManager: IRoomManager
    levelManager: IWaveLevelManager
    currentWaveRunnerGame: IWaveRunnerGame
    currentWaveIndex: number = 0
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

        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.Y) {
                this.registerOfflineWave()
            }
        })
    }

    async initialize() {
        importantLog('WaveRunnerManager', 'initialize')

        this.levelManager = new WaveLevelManager()
        this.currentWaveRunnerGame = new WaveRunnerGame()

        this.roomManager.requestWaveRunnerGame().then((state: WaveSchema) => {
            this.currentWaveRunnerGame.loadWave(new Wave(state))
        })
        // TODO: If isHost
        // this.currentWaveRunnerGame.beginWaveRunner()
        // this.registerNextWave()
    }

    update() {
        if (this.currentWaveRunnerGame) {
            this.currentWaveRunnerGame.update()
        }
    }

    async registerOfflineWave() {
        log('WaveRunnerManager', 'registerNextWave', 'prevWave', this.currentWaveIndex)

        await this.levelManager.transitionToNewLevel()

        if (this.currentWaveIndex === 0) {
            await SpawnPointManager.applySpawnPointsToPlayers()
        }

        this.currentWaveIndex++
        this.currentWaveRunnerGame.loadWave(new Wave({
            waveIndex: this.currentWaveIndex,
            totalTime: 3000,
            elapsedTime: 0
            // onSpawn: () => {
            //     this.currentWaveRunnerGame.spawner.spawn()
            // },
            // onComplete: () => {
            //     this.registerNextWave()
            // }
        }))
        this.hud.loadWave(this.currentWave)

        return this.currentWave
    }

    get currentWave() {
        return this.currentWaveRunnerGame.currentWave
    }
}
