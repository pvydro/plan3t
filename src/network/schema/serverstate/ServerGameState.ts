import { Schema, SetSchema, MapSchema, type } from '@colyseus/schema'
import { log, logError } from '../../../service/Flogger'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { CreatureSchema } from '../CreatureSchema'
import { PlayerSchema } from '../PlayerSchema'
import { ProjectileSchema } from '../ProjectileSchema'
import { ServerGravityController } from '../../controller/ServerGravityController'
import { ServerPlayerController } from '../../controller/ServerPlayerController'
import { exists } from '../../../utils/Utils'
import { v4 } from 'uuid'
import { PlanetRoom } from '../../rooms/planetroom/PlanetRoom'
import { EntitySchema } from '../EntitySchema'

interface CreateEntityOptions {
    x?: number
    y?: number
    xVel?: number
    yVel?: number
    sessionId: string
}

export interface CreateProjectileOptions extends CreateEntityOptions {
    rotation: number
    playerId: string
}

export interface CreatePlayerOptions extends CreateEntityOptions {
    name?: string
}

export interface IServerGameState {
    players: MapSchema<PlayerSchema>
    creatures: MapSchema<CreatureSchema>
    projectiles: MapSchema<ProjectileSchema>
    messages: SetSchema<ChatMessageSchema>
    hostId: string
    type: string
}

export abstract class ServerGameState extends Schema implements IServerGameState {
    @type({ map: PlayerSchema })
    players = new MapSchema<PlayerSchema>()
    @type({ map: CreatureSchema })
    creatures = new MapSchema<CreatureSchema>()
    @type({ map: EntitySchema })
    gravityEntities = new MapSchema<EntitySchema>()
    @type({ map: ProjectileSchema })
    projectiles = new MapSchema<ProjectileSchema>()
    @type({ set: ChatMessageSchema })
    messages = new SetSchema<ChatMessageSchema>()
    @type('string')
    hostId: string = ''
    @type('string')
    type: string = 'server'

    gravityController!: ServerGravityController
    playerController!: ServerPlayerController

    initialize() {
        this.gravityController = new ServerGravityController(this)
        this.playerController = new ServerPlayerController(this)
    }

    update() {
        // TODO: Instead of updating these in the state, update these outside, setting the state. <- tf do you mean
        if (this.playerController) this.playerController.update()
        if (this.gravityController) this.gravityController.update()

        this.creatures.forEach((creature: CreatureSchema) => {
            creature.update(PlanetRoom.Delta)
        })
    }

    createPlayer(options: CreatePlayerOptions) {
        log('ServerGameState', 'createPlayer', 'sessionId', options.sessionId)

        if (this.hostId === '') {
            log('ServerGameState', 'no hostId set, assigning this player as host', 'sessionId', options.sessionId)

            this.hostId = options.sessionId
        }

        this.players.set(options.sessionId, new PlayerSchema().assign({
            x: options.x ?? 0,
            y: options.y ?? 0,
            xVel: 0,
            yVel: 0
        }))
    }

    createCreature(schema: CreatureSchema) {
        schema.id = schema.id ?? v4()
        log('ServerGameState', 'createCreature', schema.id)
        this.creatures.set(schema.id, schema)
    }

    createProjectile(options: CreateProjectileOptions) {
        log('ServerGameState', 'createProjectile', 'sessionId', options.sessionId, 'playerId', options.playerId)
        if (!exists(options.x) || !exists(options.y)) {
            logError(`Tried to create projectile with no x or y. options: ${options}`)
            return
        }

        const bulletVelocity = 5
        const xVel = bulletVelocity * Math.cos(options.rotation)
        const yVel = bulletVelocity * Math.sin(options.rotation)

        this.projectiles.set(options.sessionId, new ProjectileSchema().assign({
            x: options.x,
            y: options.y,
            rotation: options.rotation,
            xVel, yVel,
            id: options.sessionId,
            playerId: options.playerId
        }))
    }
}
