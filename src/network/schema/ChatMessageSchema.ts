import { Schema, type } from '@colyseus/schema'

export class ChatMessageSchema extends Schema {
    @type('string')
    sender!: string
    @type('string')
    text!: string
}
