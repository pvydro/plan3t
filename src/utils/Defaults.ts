import { Fonts } from '../asset/Fonts'
import { Easing } from '../engine/display/tween/TweenEasing'
import { Filters } from './Filters'
import { ISmallToLargeSort } from './UtilInterfaces'

export abstract class Defaults {
    static SwipeAnimationDistance: number = 4
    static JustificationPadding: number = 2
    static LoadingScreenCloseDelay: number = 1000
}

export abstract class UIDefaults {
    static UIScale: number = 5
    static UIMargin: number = 4
    static UIEdgePadding: number = 42
    static UIScreenDefaultFilters: PIXI.Filter[] = [
        Filters.getColorMatrixFilter({
            vintage: true,
            polaroid: true
        })
    ]

    static UIBleedPastBorderMargins: ISmallToLargeSort = {
        small: 8, mdSmall: 12, lgSmall: 14,
        mid: 16, mdMid: 24, lgMid: 28,
        large: 32, mdLarge: 42, lgLarge: 48
    }
    static DefaultBleedPastBorderMargin: number = UIDefaults.UIBleedPastBorderMargins.mid
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
