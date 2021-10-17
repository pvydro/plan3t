const EventEmitter = require('eventemitter3')

export interface IEmitter {
    on(value: any, callback: any, context?: any)
    emit(value: any, data?: any)
}
export class Emitter extends EventEmitter implements IEmitter {
    constructor() {
        super()
    }

    on(value: any, callback?: any, context?: any) {
        return super.on(value, callback, context)
    }

    emit(value: any, data?: any) {
        return super.emit(value, data)
    }
}
