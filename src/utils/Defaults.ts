import { Fonts } from '../asset/Fonts'
import { Easing } from '../engine/display/tween/TweenEasing'

export class Defaults {
}

export const TextDefaults = {
    fontFamily: Fonts.Font.family,
    fontSize: 64,
    color: 0xFFFFFF,
    rescale: 0.5
}

export const AnimDefaults = {
    autoplay: false,
    duration: 0.5,
    easing: Easing.EaseOutExpo
}

export const PhysDefaults = {
    bulletVelocity: 5,
    horizontalFriction: 5,
    weight: 0
}
