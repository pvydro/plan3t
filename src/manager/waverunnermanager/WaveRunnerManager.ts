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
    registerCurrentWave(): Promise<IWave>
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
                this.registerCurrentWave()
            }
        })
    }

    async initialize() {
        importantLog('WaveRunnerManager', 'initialize')

        this.levelManager = new WaveLevelManager()
        this.currentWaveRunnerGame = new WaveRunnerGame()
        this.currentWaveRunnerGame.beginWaveRunner()
        this.registerCurrentWave()

        // setTimeout(() => {
        //     // this.roomManager.requestWaveRunnerGame().then((state: WaveRunnerSchema) => {
        //     //     this.currentWaveRunnerGame.loadWave(new Wave({
        //     //         waveIndex: state.currentWave?.waveIndex ?? 1,
        //     //         totalTime: state.currentWave?.totalTime ?? 1000,
        //     //         elapsedTime: state.currentWave?.elapsedTime ?? 0
        //     //     }))//state.currentWave))
        //     //     this.currentWaveRunnerGame.beginWaveRunner()
        //     //     this.registerCurrentWave()
        //     // })
        // }, 4000)
        // TODO: If isHost
        // this.currentWaveRunnerGame.beginWaveRunner()
        // this.registerNextWave()
    }

    update() {
        if (this.currentWaveRunnerGame) {
            this.currentWaveRunnerGame.update()
        }
    }

    async registerCurrentWave() {
        log('WaveRunnerManager', 'registerNextWave', 'prevWave', this.currentWaveIndex)

        await this.levelManager.transitionToNewLevel()

        if (this.currentWaveIndex === 0) {
            await SpawnPointManager.applySpawnPointsToPlayers()
        }

        this.currentWaveIndex++
        this.currentWaveRunnerGame.loadWave(new Wave({
            waveIndex: this.currentWaveIndex,
            totalTime: 3000,
            elapsedTime: 0,
            onSpawn: () => {
                this.currentWaveRunnerGame.spawner.spawn()
            },
            onComplete: () => {
                this.registerCurrentWave()
            }
        }))
        this.hud.loadWave(this.currentWave)

        return this.currentWave
    }

    get currentWave() {
        return this.currentWaveRunnerGame.currentWave
    }
}
