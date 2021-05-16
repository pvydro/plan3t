import { Sound } from '@pixi/sound'
import { Sounds } from '../../asset/Sounds'
import { SongKeyCodes } from '../../musicplaylist/SongKeyCodes'
import { log } from '../../service/Flogger'

export interface IMusicManager {
    fetchSong(keyCode: SongKeyCodes): Promise<Sound>
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
    
    async fetchSong(keyCode: SongKeyCodes) {
        const songUrl = MusicManager.MusicUrl + keyCode + '.wav'
        log('MusicManager', 'fetchSong', 'songUrl', songUrl)

        return Sounds.add(songUrl)
    }
}
