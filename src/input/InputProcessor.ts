import { Emitter } from '../utils/Emitter'

export interface IInputProcessor {
    
}

export enum InputEvents {
    MouseMove = 'mousemove',
    MouseDown = 'mousedown',
    MouseUp = 'mouseup',
    KeyDown = 'keydown',
    KeyUp = 'keyup',
    KeyPress = 'keypress'
}

export class InputProcessor {
    private static INSTANCE = new InputProcessor()
    private static Emitter = new Emitter()

    private constructor() {
        const clonedEvents = Object.values(InputEvents)

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