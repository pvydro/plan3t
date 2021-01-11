import * as PIXI from 'pixi.js'
import { Flogger } from '../service/Flogger'

export class SpritesheetUrls {
    private constructor() {}

    public static PLAYER_BODY_WALKING = 'assets/image/player/body/body_walking.json'
}

export class Spritesheets {
    private static _spritesheetsStartedLoading: boolean = false
    private static _spritesheetsFinishedLoading: boolean = false

    private constructor() {}

    public static async loadSpritesheets() {
        Flogger.log('Spritesheets', 'loadSpritesheets')

        return new Promise((resolve, reject) => {
            if (Spritesheets._spritesheetsStartedLoading) {
                return
            }
            Spritesheets._spritesheetsStartedLoading = true
    
            try {
                PIXI.Loader.shared.add(SpritesheetUrls.PLAYER_BODY_WALKING).load(() => {
                    Flogger.log('Spritesheets', 'Finished loading spritesheets')
                    
                    this._spritesheetsFinishedLoading = true
    
                    resolve(true)
                })
            } catch (error) {
                Flogger.error('Failed to load Spritesheets', 'Error', error)
                reject(error)
            }
        })
    }

    public static get(res: string) {
        return PIXI.Loader.shared.resources[res].spritesheet
    }

    public static isSpritesheetsFinishedLoading() {
        return this._spritesheetsFinishedLoading
    }
}
