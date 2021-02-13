import * as PIXI from 'pixi.js'
import { Fonts } from '../../asset/Fonts'

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


    constructor(options: TextSpriteOptions) {
        const fontFamily = options.fontFamily ?? Fonts.Font.family
        const fontSize = options.fontSize ?? 24
        const fill = options.fill ?? 0xFFFFFF
        const align = (options.align as string) ?? 'center'
        const roundPixels = true

        super(options.text, { fontFamily, fontSize, fill, align, roundPixels })
    }
}
