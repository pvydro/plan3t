import { TweenOptions } from './Tween'
import { Easing } from './TweenEasing'

export interface IPredefinedTween extends TweenOptions {
    offsetY?: number
    offsetX?: number
}

export class PredefinedTweens {
    static SwipeUp: IPredefinedTween = {
        duration: 0.5,
        offsetY: 6,
        ease: Easing.Power4EaseOut
    }
}
