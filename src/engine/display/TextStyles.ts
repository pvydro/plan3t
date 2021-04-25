import { Fonts } from '../../asset/Fonts'
import { TextSpriteStyle } from './TextSprite'

export interface ITextStyles {
    [ key: string ]: TextSpriteStyle
}

const _textScaleMultiplier = 4

export class TextStyles {
    static TextRescaleMultiplier: number = _textScaleMultiplier
    static Menu: ITextStyles = {
        HeaderSmall: {
            fontSize: scaleFontSize(8),
            fontFamily: Fonts.Font.family,
        },
        HeaderMedium: {
            fontSize: scaleFontSize(16),
            fontFamily: Fonts.Font.family,
        },
        HeaderBig: {
            fontSize: scaleFontSize(24),
            fontFamily: Fonts.Font.family,
        }
    }
    static TextParticle: TextSpriteStyle = {
        fontSize: scaleFontSize(16),
        fontFamily: Fonts.Font.family,
        color: 0xFFFFFF
    }
    static KeyTooltip: TextSpriteStyle = {
        fontSize: scaleFontSize(12),
        fontFamily: Fonts.Font.family,
        color: 0xFFFFFF
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
