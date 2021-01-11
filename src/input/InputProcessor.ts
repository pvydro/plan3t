import { Emitter } from '../utils/Emitter'

export interface IInputProcessor {
    
}

export class InputProcessor {
    private static INSTANCE = new InputProcessor()
    private static Emitter = new Emitter()

    private constructor() {
        const clonedEvents = [
            'mousemove', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress'
        ]

        clonedEvents.forEach((eventString: string) => {
            window.addEventListener(eventString, (event: any) => {
                InputProcessor.Emitter.emit(eventString, event)
            })
        })
    }

    public static on(event: string, callback: Function) {
        InputProcessor.Emitter.on(event, callback)
    }
}