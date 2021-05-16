import { TweenOptions } from './Tween'
import { Easing } from './TweenEasing'

export interface IPredefinedTween extends TweenOptions {
    offset?: number
}

export class PredefinedTweens {
    static Swipe: IPredefinedTween = {
        duration: 0.5,
        offset: 6,
        ease: Easing.Power4EaseOut
    }
}
