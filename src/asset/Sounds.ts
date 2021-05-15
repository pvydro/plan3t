import { sound } from '@pixi/sound'
import { Flogger, importantLog } from '../service/Flogger'

export class Sounds {
    private static _soundsStartedLoading: boolean = false

    static BaseSoundsDir: string = 'assets/sound'

    private constructor() {

    }

    static async loadSounds(): Promise<void> {
        importantLog('Sounds', 'loadSounds')

        return new Promise((resolve, reject) => {
            if (this._soundsStartedLoading) {
                return
            }
            this._soundsStartedLoading = true

            try {
                const soundKeys = Object.values(SoundUrls)

                soundKeys.forEach((key: string) => {
                    sound.add(key, key)
                })

                resolve()
            } catch (error) {
                Flogger.error('Failed to load sounds', 'error', error)

                reject(error)
            }
        })
    }

    static play(soundKey: string) {
        try {
            sound.play(soundKey)
        } catch (error) {
            Flogger.error('Error playing sound', 'soundKey', soundKey, 'erorr', error)
        }
    }
}

export class SoundUrls {
    private constructor() {

    }

    static GunshotA: string = Sounds.BaseSoundsDir + '/gunshot/a.wav'
}
