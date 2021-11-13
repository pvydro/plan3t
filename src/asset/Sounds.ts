import { sound } from '@pixi/sound'
import { Flogger, importantLog, log } from '../service/Flogger'
import { SoundDefaults } from '../utils/Defaults'

export interface PlaySoundOptions {
    volume?: number
}

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

    static add(soundKey: string) {
        return sound.add(soundKey, soundKey)
    }

    static async addAndPlay(soundKey: string) {
        sound.add(soundKey, soundKey)
        await Sounds.play(soundKey)
    }

    static async play(soundKey: string, options?: PlaySoundOptions) {
        try {
            if (SoundDefaults.soundsMuted) {
                log('Tried to play sound but muted')
            } else {
                const playedSound = await sound.play(soundKey)

                if (options) {
                    if (options.volume) {
                        playedSound.volume = options.volume
                    }
                }
            }
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

export function playSound(soundKey: string, options?: PlaySoundOptions) {
    return Sounds.play(soundKey, options)
}
