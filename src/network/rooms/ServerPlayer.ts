import { Schema, type } from '@colyseus/schema'
import { ServerEntity } from './ServerEntity'

export class ServerPlayer extends ServerEntity {
    @type('string')
    weaponName!: string

}
