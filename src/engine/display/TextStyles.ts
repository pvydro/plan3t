import { Fonts } from '../../asset/Fonts'
import { TextSpriteAlign, TextSpriteStyle } from './TextSprite'

export interface ITextStyles {
    [ key: string ]: TextSpriteStyle
}

const _textScaleMultiplier = 4

export class TextStyles {
    static TextRescaleMultiplier: number = _textScaleMultiplier

    static Menu: ITextStyles = {
        HeaderSmaller: {
            fontSize: scaleFontSize(6),
            fontFamily: Fonts.FontDefault.family
        },
        HeaderSmall: {
            fontSize: scaleFontSize(8),
            fontFamily: Fonts.FontDefault.family
        },
        HeaderSmallMd: {
            fontSize: scaleFontSize(12),
            fontFamily: Fonts.FontDefault.family
        },
        HeaderMedium: {
            fontSize: scaleFontSize(16),
            fontFamily: Fonts.FontDefault.family
        },
        HeaderBig: {
            fontSize: scaleFontSize(24),
            fontFamily: Fonts.FontDefault.family,
            uppercase: true
        }
    }

    static UIButton: ITextStyles = {
        TooltipSmall: {
            fontSize: scaleFontSize(6),
            fontFamily: Fonts.FontDefault.family,
        },
        TooltipMedium: {
            fontSize: scaleFontSize(10),
            fontFamily: Fonts.FontDefault.family,
            align: 'Center'
        }
    }

    static WeaponLabel: TextSpriteStyle = {
        fontSize: scaleFontSize(12),
        fontFamily: Fonts.FontDefault.family,
        color: 0xFFFFFF
    }

    static TextParticle: TextSpriteStyle = {
        fontSize: scaleFontSize(16),
        fontFamily: Fonts.FontDefault.family,
        color: 0xFFFFFF
    }

    static KeyTooltip: TextSpriteStyle = {
        fontSize: scaleFontSize(12),
        fontFamily: Fonts.FontDefault.family,
        color: 0xFFFFFF
    }

    static DefaultButton: ITextStyles = {
        Small: {
            fontFamily: Fonts.FontDefault.family,
            fontSize: scaleFontSize(8),
            color: 0xFFFFFF
        },
        Medium: {
            fontFamily: Fonts.FontDefault.family,
            fontSize: scaleFontSize(18),
            color: 0xFFFFFF
        }
    }

    static MetalButton: ITextStyles = {
        Medium: {
            fontFamily: Fonts.FontDefault.family,
            fontSize: scaleFontSize(18),
            color: 0x000000
        }
    }

    static InGameChat: ITextStyles = {
        Chat: {
            fontFamily: Fonts.FontTiny.family,
            fontSize: scaleFontSize(8),
            color: 0xFFFFFF
        }
    }

    static WaveCounterNumber: TextSpriteStyle = {
        fontFamily: Fonts.FontOutline.family,
        fontSize: scaleFontSize(18),
        color: 0xFFFFFF
    }

    static NextWaveHeader: TextSpriteStyle = {
        fontFamily: Fonts.FontNarrow.family,
        fontSize: scaleFontSize(16),
        color: 0xFFFFFF
    }

    static PlayerBadge: TextSpriteStyle = {
        fontFamily: Fonts.FontDefault.family,
        fontSize: scaleFontSize(10),
        color: 0xFFFFFF,
        uppercase: true
    }
}

/**
 * Translates font size via rescale-based multiplier
 * 
 * @param value Original font size
 * @returns Translated font size
 */
export function scaleFontSize(value: number) {
    return value * _textScaleMultiplier
}

/**
 * Translates TextSprite rescale via rescale-based multiplier
 * 
 * @param value Original rescale
 * @returns Translated rescale
 */
export function scaleRescale(value: number) {
    return value / _textScaleMultiplier
}
