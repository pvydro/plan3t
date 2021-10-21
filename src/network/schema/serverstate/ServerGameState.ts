import { Schema, SetSchema, MapSchema, type } from '@colyseus/schema'
import { log, logError } from '../../../service/Flogger'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { CreatureSchema } from '../CreatureSchema'
import { PlayerSchema } from '../PlayerSchema'
import { ProjectileSchema } from '../ProjectileSchema'
import { ServerGravityController } from '../../controller/ServerGravityController'
import { ServerPlayerController } from '../../controller/ServerPlayerController'
import { exists } from '../../../utils/Utils'

interface CreateEntityOptions {
    x?: number
    y?: number
    xVel?: number
    yVel?: number
    sessionId: string
}

export interface CreateProjectileOptions extends CreateEntityOptions {
    rotation: number
    bulletVelocity: number
}

export interface CreatePlayerOptions extends CreateEntityOptions {
    name?: string
}

export interface IServerGameState {

}

export class ServerGameState extends Schema implements IServerGameState {
    @type({ map: PlayerSchema })
    players = new MapSchema<PlayerSchema>()
    @type({ map: CreatureSchema })
    creatures = new MapSchema<CreatureSchema>()
    @type({ set: ProjectileSchema })
    projectiles = new SetSchema<ProjectileSchema>()
    @type({ set: ChatMessageSchema })
    messages = new SetSchema<ChatMessageSchema>()
    @type('string')
    hostId: string = ''

    gravityController!: ServerGravityController
    playerController!: ServerPlayerController

    initialize() {
        this.gravityController = new ServerGravityController(this)
        this.playerController = new ServerPlayerController(this)
    }

    update() {
        // this.players.forEach((player: PlayerSchema) => {
        //     player.x += player.xVel * GameRoom.Delta
        //     player.y += player.yVel * GameRoom.Delta
        // })

        // TODO: Instead of updating these in the state, update these outside, setting the state. <- tf do you mean
        if (this.playerController) this.playerController.update()
        if (this.gravityController) this.gravityController.update()
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

    }

    createProjectile(options: CreateProjectileOptions) {
        if (!exists(options.x) || !exists(options.y)) {
            logError(`Tried to create projectile with no x or y. options: ${options}`)
            return
        }

        const xVel = options.bulletVelocity * Math.cos(options.rotation)
        const yVel = options.bulletVelocity * Math.sin(options.rotation)

        this.projectiles.add(new ProjectileSchema().assign({
            x: options.x,
            y: options.y,
            rotation: options.rotation,
            xVel, yVel,
            velocity: options.bulletVelocity,
            sessionId: options.sessionId
        }))
    }
}
