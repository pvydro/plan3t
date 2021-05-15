import { Sounds } from '../../asset/Sounds'

export interface ISoundManager {

}

export class SoundManager implements ISoundManager {
    // static Instance: ISoundManager

    // static getInstance(): ISoundManager {
    //     if (!this.Instance) {
    //         this.Instance = new SoundManager()
    //     }

    //     return this.Instance
    // }

    private constructor() {
        
    }

    static playSound(soundKey: string) {
        return Sounds.play(soundKey)
    }
}
