import { TweenDirection } from './Tween'
import { Easing } from './TweenEasing'

export interface IPredefinedTween {
    duration?: number
    ease?: gsap.EaseFunction
    autoplay?: boolean
    direction?: TweenDirection
    offsetY?: number
    offsetYX?: number
    [ key: string ]: any
}

export class PredefinedTweens {
    static SwipeUp: IPredefinedTween = {
        duration: 0.5,
        offsetY: 6,
        ease: Easing.Power4EaseOut
    }
}
