import * as PIXI from 'pixi.js'
import { Fonts } from '../../asset/Fonts'
import { Flogger } from '../../service/Flogger'
import { IDimension } from '../math/Dimension'

export enum TextSpriteAlign {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

export interface ITextSprite {

}

export interface TextSpriteOptions {
    text: string
    fontFamily?: string
    fontSize?: number
    fill?: number
    align?: TextSpriteAlign
}

export class TextSprite extends PIXI.Text implements ITextSprite {
    style: PIXI.TextStyle
    textDimensions: IDimension

    constructor(options: TextSpriteOptions) {
        const fontFamily = options.fontFamily ?? Fonts.Font.family
        const fontSize = options.fontSize ?? 12
        const fill = options.fill ?? 0xFFFFFF
        const align = (options.align as string) ?? 'center'

        const style = new PIXI.TextStyle({ fontFamily, fontSize, fill, align })
        
        super(options.text, style)
        
        this.style = style
        this.textDimensions = PIXI.TextMetrics.measureText(options.text, style)

        if (align === TextSpriteAlign.Center) {
            this.position.x -= (this.textWidth / 2)
        }
    }

    get textWidth() {
        return this.textDimensions.width
    }

    get textHeight() {
        return this.textDimensions.height
    }
}
