import { Dimension } from '../../engine/math/Dimension'
import { SphericalBiome, SphericalData } from '../../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../../gamemap/spherical/SphericalPoint'
import { Environment } from '../../main/Environment'
import { PlanetSphericalSchema } from '../../network/schema/planetgamestate/PlanetSphericalSchema'
import { IServerGameState } from '../../network/schema/serverstate/ServerGameState'
import { IPVPGameRoomState } from '../../network/schema/pvpgamestate/PVPGameRoomState'
import { IWaveRunnerGameState } from '../../network/schema/waverunnergamestate/WaveRunnerGameState'
import { ChatService } from '../../service/chatservice/ChatService'
import { importantLog, log, VerboseLogging } from '../../service/Flogger'
import { EntityManager, IEntityManager } from '../entitymanager/EntityManager'
import { IWaveRunnerManager, WaveRunnerManager } from '../waverunnermanager/WaveRunnerManager'
import { RoomManager } from './RoomManager'
import { gameMapMan } from '../../shared/Dependencies'

enum ServerStateType {
    WaveRunner = 'waverunner',
    Planet = 'planet',
    Pvp = 'pvp'
}

export interface IRoomStateManager {
    currentState?: IServerGameState
    stateChanged(newState: IServerGameState): void
    setInitialState(state: IServerGameState): Promise<void>
}

export class RoomStateManager implements IRoomStateManager {
    currentState?: IServerGameState
    waveRunnerManager: IWaveRunnerManager
    entityManager: IEntityManager

    constructor() {
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

    handlePVPRoomState(newState: IPVPGameRoomState) {
        if (newState.pvpGameHasStarted) {
            if (newState.currentMap !== gameMapMan.gameMap.currentMapBuildingType) {
                gameMapMan.initializeBuilding(newState.currentMap)
            }
        }
        // if (newState.players) {
        //     newState.players.forEach((player) => {
        //         const entity = this.entityManager.clientEntities.get(player.id).clientEntity

        //         if (entity) {
        //             entity.x = player.x
        //             entity.y = player.y
        //         } else {
        //             logError('RoomStateManager', 'Player unaccounted for', player.id)
        //         } 
        //     })
        // }
    }

    handleWaveRunnerRoomState(newState: IWaveRunnerGameState) {
        if (newState.waveRunner && newState.waveRunner.currentWave) {
            const wave = newState.waveRunner?.currentWave ?? undefined

            if (wave) {
                if (wave.currentMap !== gameMapMan.gameMap.currentMapBuildingType) {
                    gameMapMan.initializeBuilding(wave.currentMap)
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
            this.handleWaveRunnerRoomState(newState as IWaveRunnerGameState)
        } else if (newState.type === ServerStateType.Pvp) {
            this.handlePVPRoomState(newState as IPVPGameRoomState)
        }
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

        await gameMapMan.initialize(sphericalData)
    }

}
