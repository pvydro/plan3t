import { Fonts } from '../asset/Fonts'
import { Easing } from '../engine/display/tween/TweenEasing'
import { IDimension } from '../engine/math/Dimension'
import { IVector2 } from '../engine/math/Vector2'
import { Filters } from './Filters'
import { ISmallToLargeSort } from './UtilInterfaces'

export abstract class Defaults {
    static SwipeAnimationDistance: number = 4
    static JustificationPadding: number = 6
    static LoadingScreenCloseDelay: number = 1000
}

export abstract class UIDefaults {
    static UIScale: number = 6//5
    static UIMargin: number = 4
    static UIEdgePadding: number = 42
    static UIScreenDefaultFilters: PIXI.Filter[] = [
        Filters.getColorMatrixFilter({
            vintage: true,
            polaroid: true
        })
    ]
    static ChatboxDimensions: IDimension = {
        width: 64,
        height: 32
    }

    static UIBleedPastBorderMargins: ISmallToLargeSort = {
        small: 8, mdSmall: 12, lgSmall: 14,
        mid: 16, mdMid: 22, lgMid: 28,
        large: 32, mdLarge: 42, lgLarge: 48
    }
    static DefaultBleedPastBorderMargin: number = UIDefaults.UIBleedPastBorderMargins.mid

}

export const TimeDefaults = {
    CrosshairStateSwapDelay: 500
}

export const SoundDefaults = {
    soundsMuted: false,
    musicMuted: false
}

export const TextDefaults = {
    fontFamily: Fonts.FontDefault.family,
    fontSize: 64,
    color: 0xFFFFFF,
    rescale: 0.5
}

export const AnimDefaults = {
    autoplay: false,
    duration: 0.5,
    casecadeSpacing: 125,
    easing: Easing.EaseOutExpo
}

export const PhysDefaults = {
    bulletVelocity: 5,
    horizontalFriction: 5,
    weight: 0
}
