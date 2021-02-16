import gsap from 'gsap/all'

export interface TweenCallbacks {
    onUpdate: () => void
}

export interface TweenOptions {
    duration?: number
    ease?: gsap.EaseFunction
    [ key: string ]: any
}

export class Tween {
    static to(target: any, options: any): gsap.core.Tween {
        return gsap.to(target, options)
    }
}
