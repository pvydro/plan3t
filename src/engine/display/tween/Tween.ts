import gsap from 'gsap/all'
import { Easing } from './TweenEasing'

export enum TweenDirection {
    Normal = 'normal',
    Reverse = 'reverse',
    Alternate = 'alternate'
}

export interface TweenCallbacks {
    onUpdate: () => void
    onComplete: () => void
}

export interface TweenOptions {
    duration?: number
    ease?: gsap.EaseFunction
    autoplay?: boolean
    direction?: TweenDirection
    [ key: string ]: any
}

export class Tween {
    static to(target: any, options: TweenOptions): gsap.core.Tween {
        options = Tween.applyOptionsDefaults(options)

        return gsap.to(target, options)
    }

    private static applyOptionsDefaults(options: TweenOptions): TweenOptions {
        const autoplay = options.autoplay !== undefined ? options.autoplay : false

        options.duration = options.duration ?? 0.5
        options.ease = options.ease ?? Easing.EaseOutExpo
        options.paused = !autoplay
        options.direction = options.direction ?? TweenDirection.Normal

        return options
    }
}
