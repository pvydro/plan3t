import { Emitter } from '../utils/Emitter'

export interface IInputProcessor {
    
}

export enum InputEvents {
    MouseMove = 'mousemove',
    MouseDown = 'mousedown',
    MouseUp = 'mouseup',
    KeyDown = 'keydown',
    KeyUp = 'keyup',
    KeyPress = 'keypress',
    Resize = 'resize'
}

export class InputProcessor {
    private static Instance = new InputProcessor()
    private static Emitter = new Emitter()
    static MouseDown: boolean = false

    private constructor() {
        const clonedEvents = Object.values(InputEvents)

        clonedEvents.forEach((eventString: string) => {
            window.addEventListener(eventString, (event: any) => {
                InputProcessor.Emitter.emit(eventString, event)
            })
        })

        window.addEventListener('mousedown', (ev: MouseEvent) => {
            InputProcessor.MouseDown = true
        })
        window.addEventListener('mouseup', (ev: MouseEvent) => {
            InputProcessor.MouseDown = false
        })
    }

    public static on(event: string, callback: Function) {
        InputProcessor.Emitter.on(event, callback)
    }

    // TODO: This doesnt work
    public static off(event: string, callback: Function) {
        InputProcessor.Emitter.removeListener(event, callback)
    }
}