import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { importantLog, log } from '../../service/Flogger'
import { IInGameHUD, InGameHUD } from '../../ui/ingamehud/InGameHUD'
import { WaveRunnerCounter } from '../../ui/ingamehud/waverunnercounter/WaveRunnerCounter'
import { UIComponentType } from '../../ui/UIComponentFactory'
import { IWave, Wave } from '../../waverunner/Wave'
import { IWaveRunnerGame, WaveRunnerGame } from '../../waverunner/WaveRunnerGame'
import { IWaveLevelManager, WaveLevelManager } from './WaveLevelManager'
import { IWaveSpawnPointManager, WaveSpawnPointManager } from './WaveSpawnPointManager'

export interface IWaveRunnerManager {
    initialize(): Promise<void>
    registerNextWave(): Promise<IWave>
}

export class WaveRunnerManager implements IWaveRunnerManager {
    private static Instance: IWaveRunnerManager
    levelManager: IWaveLevelManager
    spawnPointManager: IWaveSpawnPointManager
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

        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.Y) {
                this.registerNextWave()
            }
        })
    }

    async initialize() {
        importantLog('WaveRunnerManager', 'initialize')

        this.levelManager = new WaveLevelManager()
        this.spawnPointManager = new WaveSpawnPointManager()
        this.currentWaveRunnerGame = new WaveRunnerGame()
        this.currentWaveRunnerGame.beginWaveRunner()
        this.registerNextWave()
    }

    async registerNextWave() {
        log('WaveRunnerManager', 'registerNextWave', 'prevWave', this.currentWaveIndex)

        await this.levelManager.transitionToNewLevel()

        if (this.currentWaveIndex === 0) {
            await this.spawnPlayers()
        }

        this.currentWaveIndex++

        const wave = new Wave({
            waveIndex: this.currentWaveIndex,
            onSpawn: () => {
                this.currentWaveRunnerGame.spawner.spawn()
            }
        })
        this.currentWaveRunnerGame.loadWave(wave)
        
        this.hud.loadWave(this.currentWave)
        const waveCounter = this.hud.getComponent(UIComponentType.HUDWaveCounter) as WaveRunnerCounter
        
        if (waveCounter) {
            waveCounter.setWaveValue(this.currentWave)
        }


        return wave

    }

    async spawnPlayers() {
        await this.spawnPointManager.applySpawnPointsToPlayers()
    }

    get currentWave() {
        return this.currentWaveRunnerGame.currentWave
    }
}
