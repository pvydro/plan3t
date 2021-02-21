import { Room } from 'colyseus.js'
import { PlanetGameState, PlanetSphericalSchema } from '../../network/schema/planetgamestate/PlanetGameState'
import { Entity } from '../../network/rooms/Entity'
import { IClientManager } from '../ClientManager'
import { IEntityManager } from '../entitymanager/EntityManager'
import { Flogger } from '../../service/Flogger'
import { IGameMapManager } from '../GameMapManager'
import { SphericalBiome, SphericalData } from '../../gamemap/spherical/SphericalData'
import { SphericalPoint } from '../../gamemap/spherical/SphericalPoint'
import { Dimension } from '../../engine/math/Dimension'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { Projectile } from '../../network/schema/planetgamestate/PlanetGameState'
import { RoomMessenger } from './RoomMessenger'
import { Player } from '../../network/rooms/Player'
import { ProjectileType } from '../../weapon/projectile/Bullet'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'

export interface IRoomManager {
    initializeRoom(): Promise<Room>
    currentRoom: Room
}

export interface RoomManagerOptions {
    clientManager: IClientManager
    gameMapManager: IGameMapManager
}

export class RoomManager implements IRoomManager {
    private static INSTANCE: RoomManager
    static _room: Room<PlanetGameState>
    static _clientSessionId = 'local'
    
    gameMapManager: IGameMapManager
    clientManager: IClientManager
    entityManager: IEntityManager

    static getInstance(options?: RoomManagerOptions): RoomManager | undefined {
        if (RoomManager.INSTANCE === undefined) {
            if (options === undefined) {
                return undefined
            } else {
                RoomManager.INSTANCE = new RoomManager(options)
            }
        }

        return RoomManager.INSTANCE
    }

    private constructor(options: RoomManagerOptions) {
        this.clientManager = options.clientManager
        this.gameMapManager = options.gameMapManager
        this.entityManager = this.clientManager.entityManager
    }

    async initializeRoom(): Promise<Room> {
        Flogger.log('RoomManager', 'initializeRoom')
        const client = this.clientManager.client

        this.currentRoom = await client.joinOrCreate<PlanetGameState>('GameRoom')

        RoomManager.clientSessionId = this.currentRoom.sessionId
        RoomMessenger._isOnline = true
        
        this.initializeCurrentRoomEntities()

        return new Promise((resolve) => {
            // First state change
            this.currentRoom.onStateChange.once((state) => {
                Flogger.log('RooManager', 'firstState received')
                
                if (state.planetHasBeenSet) {
                    if (state.planetSpherical !== undefined) {
                        this.parseRoomSpherical(state.planetSpherical).then(() => {
                            resolve(this.currentRoom)
                        })
                    }
                } else {
                    this.createMapAndSendToRoom().then(() => {
                        this.roomState.planetHasBeenSet = true

                        resolve(this.currentRoom)
                    })
                }
            })
        })
    }

    initializeCurrentRoomEntities() {
        this.currentRoom.state.players.onAdd = (player: Player, sessionId: string) => {
            this.addPlayer(player, sessionId)
        }
        this.currentRoom.state.players.onRemove = (player: Player, sessionId: string) => {
            this.removePlayer(sessionId)
        }

        this.currentRoom.state.projectiles.onAdd = (projectile: Projectile, key: number) => {
            if (projectile.sessionId !== RoomManager.clientSessionId) {
                this.addProjectile(projectile)
            }
        }
    }

    async parseRoomSpherical(schema: PlanetSphericalSchema) {
        Flogger.log('RoomManager', 'parseRoomSpherical', 'schema', schema)

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

    async createMapAndSendToRoom(): Promise<void> {
        await this.gameMapManager.initializeRandomSpherical()

        const currentData = this.gameMapManager.gameMap.currentSpherical.data

        this.currentRoom.send(RoomMessage.NewPlanet, { planet: currentData.toPayloadFormat() })
    }

    addPlayer(entity: Entity, sessionId: string) {
        if (RoomManager.isSessionALocalPlayer(sessionId)) {
            this.entityManager.createClientPlayer(entity, sessionId)
        } else {
            this.entityManager.createEnemyPlayer(entity, sessionId)
        }
    
        entity.onChange = (changes) => {
            this.entityManager.updateEntity(entity, sessionId, changes)
        }
    }

    removePlayer(sessionId: string) {
        this.entityManager.removeEntity(sessionId)
    }

    addProjectile(projectile: Projectile) {
        this.entityManager.createProjectile(ProjectileType.Bullet,
            projectile.x, projectile.y, projectile.rotation, projectile.velocity)
    }

    requestClientPlayerRespawn() {
        const clientPlayer = ClientPlayer.getInstance()

        clientPlayer.requestRespawn()
    }

    static isSessionALocalPlayer(sessionId: string) {
        if (sessionId === RoomManager.clientSessionId) {
            return true
        } else {
            return false
        }
    }

    static set clientSessionId(value: string) {
        Flogger.color('red')
        Flogger.log('New client session ID has been set', value)
        
        this._clientSessionId = value
    }

    static get clientSessionId() {
        return this._clientSessionId
    }

    get currentRoom() {
        return RoomManager._room
    }

    set currentRoom(value) {
        RoomManager._room = value
    }

    get client() {
        return this.clientManager.client
    }

    get roomState() {
        return this.currentRoom.state
    }
}
