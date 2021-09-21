import { Sound } from '@pixi/sound'
import { Sounds } from '../../asset/Sounds'
import { log } from '../../service/Flogger'

export interface IMusicManager {
    fetchSong(): void
}

export class MusicManager implements IMusicManager {
    private static Instance: IMusicManager
    private static MusicUrl: string = 'http://storage.googleapis.com/www.paydinfull.com/musik/'
    // 'http://www.paydinfull.com/musik/' 
    //'http://storage.googleapis.com/www.paydro.dev/musik/'
    //'https://paydro.dev/musik/'

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new MusicManager()
        }

        return this.Instance
    }

    private constructor() {

    }
    
    async fetchSong() {
        // const songUrl = MusicManager.MusicUrl + keyCode + '.wav'
        // log('MusicManager', 'fetchSong', 'songUrl', songUrl)

        // return Sounds.add(songUrl)
    }
}
