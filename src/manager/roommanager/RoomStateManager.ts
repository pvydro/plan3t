import { Dimension } from '../../engine/math/Dimension'
import { SphericalBiome, SphericalData } from '../../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../../gamemap/spherical/SphericalPoint'
import { Environment } from '../../main/Environment'
import { PlanetSphericalSchema } from '../../network/schema/planetgamestate/PlanetSphericalSchema'
import { IServerGameState } from '../../network/schema/serverstate/ServerGameState'
import { IWaveRunnerGameState } from '../../network/schema/waverunnergamestate/WaveRunnerGameState'
import { WaveRunnerSchema } from '../../network/schema/waverunnergamestate/WaveRunnerSchema'
import { ChatService } from '../../service/chatservice/ChatService'
import { importantLog, log, VerboseLogging } from '../../service/Flogger'
import { IGameMapManager } from '../GameMapManager'
import { WaveRunnerManager } from '../waverunnermanager/WaveRunnerManager'
import { RoomManager, RoomManagerOptions } from './RoomManager'

enum ServerStateType {
    WaveRunner = 'waverunner',
    Planet = 'planet'
}

export interface IRoomStateManager {
    currentState?: IServerGameState
    stateChanged(newState: IServerGameState): void
    setInitialState(state: IServerGameState): Promise<void>
    configureLocalWaveRunner(schema: WaveRunnerSchema): void
}

export class RoomStateManager implements IRoomStateManager {
    currentState?: IServerGameState
    gameMapManager: IGameMapManager

    constructor(options: RoomManagerOptions) {
        this.gameMapManager = options.gameMapManager
    }

    async setInitialState(state: IServerGameState) {
        log('RoomStateManager', 'setInitialState')

        this.stateChanged(state)

        if (RoomManager.clientSessionId === state.hostId) {
            importantLog('Host sessionId found, setting in Environment', 'sessionId', RoomManager.clientSessionId)

            Environment.IsHost = true
        }
    }

    handleWaveRunnerState(newState: IWaveRunnerGameState) {
        if (newState.waveRunner && newState.waveRunner.currentWave) {
            const wave = newState.waveRunner.currentWave
            if (wave.currentMap !== this.gameMapManager.gameMap.currentMapBuildingType) {
                this.gameMapManager.initializeBuilding(wave.currentMap)
            }
        }
    }

    stateChanged(newState: IServerGameState) {
        if (VerboseLogging) log('RoomStateManager', 'newState', newState)

        this.currentState = newState

        const messages = newState.messages

        if (ChatService._serverMessages !== messages) {
            ChatService._serverMessages = messages
            ChatService.fetchChatHistoryFromRoom()
        }

        if (newState.type === ServerStateType.WaveRunner) {
            this.handleWaveRunnerState(newState as IWaveRunnerGameState)
        }
    }

    configureLocalWaveRunner(schema: WaveRunnerSchema) {
        log('RoomStateManager', 'configureLocalWaveRunner', 'schema', schema)

        const waveRunner = WaveRunnerManager.getInstance()
    }

    async parseRoomSpherical(schema: PlanetSphericalSchema) {
        log('RoomManager', 'parseRoomSpherical', 'schema', {
            'biome': schema.biome,
            'dimension': schema.dimension
        })

        const parsedPoints = []

        schema.points.forEach((point) => {
            parsedPoints.push(new SphericalPoint({
                x: point.x, y: point.y,
                tileSolidity: point.tileSolidity,
                tileValue: {
                    r: point.tileValue.r,
                    g: point.tileValue.g,
                    b: point.tileValue.b,
                    a: point.tileValue.a
                }
            }))
        })

        const sphericalData = new SphericalData({
            points: parsedPoints,
            biome: (schema.biome as SphericalBiome),
            dimension: new Dimension(schema.dimension.width, schema.dimension.height)
        })

        await this.gameMapManager.initialize(sphericalData)
    }

}
