import { Flogger } from '../service/Flogger'
const FontFaceObserver = require('fontfaceobserver')

export class Fonts {
    private static _fontsStartedLoading: boolean = false
    private static _fontsFinishedLoading: boolean = false
    static FontStrong: any = new FontFaceObserver('Pixel')
    static Font: any = new FontFaceObserver('iPU')
    private static _fonts = [
        Fonts.FontStrong, Fonts.Font
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
                // Fonts.FontStrong


                // Fonts.FontStrong.load().then(() => {
                //     Flogger.color('yellow')
                //     Flogger.log('Fonts', 'Pixel loaded')

                //     resolve(true)
                // }, (error) => {
                //     Flogger.error('Failed to load font', 'error', error)
                //     resolve(error)
                // })

            } catch (error) {
                Flogger.error('Failed to load fonts', 'error', error)
            }
        })
    }
}
