import * as PIXI from 'pixi.js'
import { LoggingService } from '../service/LoggingService'

export class SpritesheetUrls {
    private constructor() {}

    public static PLAYER_BODY_WALKING = 'assets/image/player/body/body_walking.json'
}

export class Spritesheets {
    private static _spritesheetsStartedLoading: boolean = false
    private static _spritesheetsFinishedLoading: boolean = false

    private constructor() {}

    public static loadSpritesheets() {
        LoggingService.log('Spritesheets', 'loadSpritesheets')

        if (Spritesheets._spritesheetsStartedLoading) {
            return
        }
        Spritesheets._spritesheetsStartedLoading = true

        // Load
        PIXI.Loader.shared.add(SpritesheetUrls.PLAYER_BODY_WALKING).load(() => {
            LoggingService.log('Spritesheets', 'Finished loading spritesheets')
            
            this._spritesheetsFinishedLoading = true
        })
    }

    public static get(res: string) {
        return PIXI.Loader.shared.resources[res] ? PIXI.Loader.shared.resources[res].spritesheet : undefined
    }

    public static isSpritesheetsFinishedLoading() {
        return this._spritesheetsFinishedLoading
    }
}
