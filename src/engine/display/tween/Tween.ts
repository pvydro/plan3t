import * as PIXI from 'pixi.js'
import gsap from 'gsap/all'
import { PixiPlugin } from 'gsap/PixiPlugin'
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
    static async initializePlugins() {
        gsap.registerPlugin(PixiPlugin)

        PixiPlugin.registerPIXI(PIXI)
    }

    static to(target: any, options: TweenOptions): gsap.core.Tween {
        options = Tween.applyDefaultsToOptions(options)

        return gsap.to(target, options)
    }

    private static applyDefaultsToOptions(options: TweenOptions): TweenOptions {
        const autoplay = options.autoplay !== undefined ? options.autoplay : false

        options.duration = options.duration ?? 0.5
        options.ease = options.ease ?? Easing.EaseOutExpo
        options.paused = !autoplay
        options.direction = options.direction ?? TweenDirection.Normal

        return options
    }
}
