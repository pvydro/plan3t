import { Dimension } from '../../engine/math/Dimension'
import { SphericalBiome, SphericalData } from '../../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../../gamemap/spherical/SphericalPoint'
import { Environment } from '../../main/Environment'
import { CreatureSchema } from '../../network/schema/CreatureSchema'
import { PlanetSphericalSchema } from '../../network/schema/planetgamestate/PlanetSphericalSchema'
import { IServerGameState } from '../../network/schema/serverstate/ServerGameState'
import { IWaveRunnerGameState } from '../../network/schema/waverunnergamestate/WaveRunnerGameState'
import { ChatService } from '../../service/chatservice/ChatService'
import { importantLog, log, logError, VerboseLogging } from '../../service/Flogger'
import { EntityManager, IEntityManager } from '../entitymanager/EntityManager'
import { IGameMapManager } from '../GameMapManager'
import { IWaveRunnerManager, WaveRunnerManager } from '../waverunnermanager/WaveRunnerManager'
import { RoomManager, RoomManagerOptions } from './RoomManager'

enum ServerStateType {
    WaveRunner = 'waverunner',
    Planet = 'planet'
}

export interface IRoomStateManager {
    currentState?: IServerGameState
    stateChanged(newState: IServerGameState): void
    setInitialState(state: IServerGameState): Promise<void>
}

export class RoomStateManager implements IRoomStateManager {
    currentState?: IServerGameState
    gameMapManager: IGameMapManager
    waveRunnerManager: IWaveRunnerManager
    entityManager: IEntityManager

    constructor(options: RoomManagerOptions) {
        this.gameMapManager = options.gameMapManager
        this.waveRunnerManager = WaveRunnerManager.getInstance()
        this.entityManager = EntityManager.getInstance()
    }

    async setInitialState(state: IServerGameState) {
        log('RoomStateManager', 'setInitialState')

        this.stateChanged(state)

        if (RoomManager.clientSessionId === state.hostId) {
            importantLog('Host sessionId found, setting in Environment', 'sessionId', RoomManager.clientSessionId)

            Environment.isHost = true
        }
    }

    handleWaveRunnerState(newState: IWaveRunnerGameState) {
        if (newState.waveRunner && newState.waveRunner.currentWave) {
            const wave = newState.waveRunner?.currentWave ?? undefined

            if (wave) {
                if (wave.currentMap !== this.gameMapManager.gameMap.currentMapBuildingType) {
                    this.gameMapManager.initializeBuilding(wave.currentMap)
                }
    
                if (wave.waveIndex !== this.waveRunnerManager.currentWaveIndex) {
                    this.waveRunnerManager.registerWave(wave)
                } else {
                    this.waveRunnerManager.currentWave.elapsedTime = wave.elapsedTime
                    this.waveRunnerManager.currentWave.totalTime = wave.totalTime
                }
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

        // Apply creature state to creatures
        // newState.creatures.forEach((creature: CreatureSchema) => {
        //     const entity = this.entityManager.clientEntities.get(creature.id).clientEntity

        //     if (entity) {
        //         entity.x = creature.x
        //         entity.y = creature.y
        //     } else {
        //         logError('RoomStateManager', 'Creature unaccounted for', creature.id)
        //     } 
        // })
    }

    async parseRoomSpherical(schema: PlanetSphericalSchema) {
        log('RoomManager', 'parseRoomSpherical', 'schema', { 'biome': schema.biome, 'dimension': schema.dimension })

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
