import { Flogger } from '../service/Flogger'
const FontFaceObserver = require('fontfaceobserver')

export class Fonts {
    private static _fontsStartedLoading: boolean = false
    private static _fontsFinishedLoading: boolean = false
    static FontStrong: any = new FontFaceObserver('Pixel')
    static FontDefault: any = new FontFaceObserver('iPU')
    static FontOutline: any = new FontFaceObserver('Origami Mommy')
    private static _fonts = [
        Fonts.FontStrong, Fonts.FontDefault
    ]
    
    
    private constructor() {}

    static async loadFonts() {
        Flogger.log('Fonts', 'loadFonts')

        return new Promise(async (resolve, reject) => {
            if (Fonts._fontsStartedLoading) {
                return
            }
            this._fontsStartedLoading = true

            try {
                Fonts._fonts.forEach(async (font: any) => {
                    Flogger.log('Fonts', 'loading font', font.family)
                    await font.load()
                })

                resolve(true)
            } catch (error) {
                Flogger.error('Failed to load fonts', 'error', error)
            }
        })
    }
}
