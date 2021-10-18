import { Schema, SetSchema, MapSchema, type } from '@colyseus/schema'
import { GameRoom } from '../../rooms/GameRoom'
import { log } from '../../../service/Flogger'
import { ChatMessageSchema } from '../ChatMessageSchema'
import { CreatureSchema } from '../CreatureSchema'
import { PlayerSchema } from '../PlayerSchema'
import { ProjectileSchema } from '../ProjectileSchema'
import { ServerGravityController } from './controller/ServerGravityController'
import { ServerPlayerController } from './controller/ServerPlayerController'

export class ServerGameState extends Schema {
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

    createPlayer(sessionId: string, x?: number, y?: number) {
        log('PlanetGameState', 'createPlayer', 'sessionId', sessionId)

        if (this.hostId === '') {
            log('PlanetGameState', 'no hostId set, assigning player as host', 'sessionId', sessionId)

            this.hostId = sessionId
        }

        this.players.set(sessionId, new PlayerSchema().assign({
            x: x ?? 0,
            y: y ?? 0,
            xVel: 0,
            yVel: 0
        }))
    }

    createCreature(schema: CreatureSchema) {

    }

    createProjectile(schema: ProjectileSchema) {
        this.projectiles.add(new ProjectileSchema().assign({
            x: schema.x,
            y: schema.y,
            rotation: schema.rotation,
            velocity: schema.velocity,
            sessionId: schema.sessionId
        }))
    }

    update() {
        this.players.forEach((player: PlayerSchema) => {
            player.x += player.xVel * GameRoom.Delta
            player.y += player.yVel * GameRoom.Delta
        })

        // TODO: Instead of updating these in the state, update these outside, setting the state. <- tf do you mean
        if (this.playerController) this.playerController.update()
        if (this.gravityController) this.gravityController.update()
    }

}
