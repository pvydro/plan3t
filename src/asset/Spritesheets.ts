import * as PIXI from 'pixi.js'
import { Flogger } from '../service/Flogger'

export class SpritesheetUrls {
    private constructor() {

    }

    static PlayerBodyWalking = 'assets/image/player/body/body_walking.json'
    static PlayerBodyJumping = 'assets/image/player/body/body_jumping.json'
    static PlayerBodyDying = 'assets/image/player/body/body_dying.json'

    static SormWalking = 'assets/image/enemy/sorm/sorm_walking.json'
    static SormDying = 'assets/image/enemy/sorm/sorm_dying.json'
    static SormAttacking = 'assets/image/enemy/sorm/sorm_attacking.json'
}

export class Spritesheets {
    private static _spritesheetsStartedLoading: boolean = false
    private static _spritesheetsFinishedLoading: boolean = false

    private constructor() {
        
    }

    static async loadSpritesheets() {
        Flogger.log('Spritesheets', 'loadSpritesheets')

        return new Promise((resolve, reject) => {
            if (Spritesheets._spritesheetsStartedLoading) {
                return
            }
            Spritesheets._spritesheetsStartedLoading = true
    
            try {
                const assetKeys = Object.values(SpritesheetUrls)

                PIXI.Loader.shared.add(assetKeys).load(() => {
                    Flogger.log('Spritesheets', 'Finished loading spritesheets')
                    
                    this._spritesheetsFinishedLoading = true
    
                    resolve(true)
                })
            } catch (error) {
                Flogger.error('Failed to load Spritesheets', 'error', error)
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
