const EventEmitter = require('eventemitter3')

export interface IEmitter {
}
export class Emitter extends EventEmitter implements IEmitter {
    constructor() {
        super()
    }
}
