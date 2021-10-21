import { Dimension } from '../../engine/math/Dimension'
import { MapBuildingType } from '../../gamemap/mapbuilding/MapBuilding'
import { SphericalBiome, SphericalData } from '../../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../../gamemap/spherical/SphericalPoint'
import { Environment } from '../../main/Environment'
import { PlanetSphericalSchema } from '../../network/schema/planetgamestate/PlanetSphericalSchema'
import { ServerGameState } from '../../network/schema/serverstate/ServerGameState'
import { WaveRunnerSchema } from '../../network/schema/waverunner/WaveRunnerSchema'
import { ChatService } from '../../service/chatservice/ChatService'
import { importantLog, log, VerboseLogging } from '../../service/Flogger'
import { IGameMapManager } from '../GameMapManager'
import { WaveRunnerManager } from '../waverunnermanager/WaveRunnerManager'
import { RoomManager, RoomManagerOptions } from './RoomManager'

export interface IRoomStateManager {
    currentState?: ServerGameState
    stateChanged(newState: ServerGameState): void
    setInitialState(state: ServerGameState): Promise<void>
    configureLocalWaveRunner(schema: WaveRunnerSchema): void
}

export class RoomStateManager implements IRoomStateManager {
    currentState?: ServerGameState
    gameMapManager: IGameMapManager

    constructor(options: RoomManagerOptions) {
        this.gameMapManager = options.gameMapManager
    }

    async setInitialState(state: ServerGameState) {
        log('RoomStateManager', 'setInitialState')

        this.stateChanged(state)

        if (RoomManager.clientSessionId === state.hostId) {
            importantLog('Host sessionId found, setting in Environment', 'sessionId', RoomManager.clientSessionId)

            Environment.IsHost = true
        }
        // if (state instanceof PlanetGameState && state.planetHasBeenSet) {
        
        //     if (state.planetSpherical !== undefined) {
        //         await this.parseRoomSpherical(state.planetSpherical)
        //     }
        // }
        await this.gameMapManager.initializeBuilding(MapBuildingType.Dojo)
    }

    stateChanged(newState: ServerGameState) {
        if (VerboseLogging) log('RoomStateManager', 'newState', newState)

        this.currentState = newState

        const messages = newState.messages

        if (ChatService._serverMessages !== messages) {
            ChatService._serverMessages = messages
            ChatService.fetchChatHistoryFromRoom()
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
