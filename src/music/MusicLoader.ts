import { importantLog, log } from '../service/Flogger'

export interface IMusicLoader {
    loadSongs(): Promise<void>
}

export class MusicLoader implements IMusicLoader {
    songDir: string = '../../../../fl/s/game/'
    allSongs: Map<string, any>

    loadSongs(): Promise<void> {
        log('MusicLoader', 'loadSongz')

        return new Promise((resolve) => {
            // const 
            // glob(`${this.songDir}*.wav`, (files) => {
            //     for (var i in files) {
            //         importantLog(files[i])
            //     }
            // })
            // fs.readdirSync(this.songDir).forEach(file => {
            //     importantLog(file)
            // })
            resolve()
        })
    }
}
