// import { Storage } from '@google-cloud/storage'
// const { Storage } = require('@google-cloud/storage')
import { importantLog } from '../service/Flogger'
// import SC from 'soundcloud'

// export enum MusicCloudBuckets {
//     PaydInFullMusic = 'http://storage.googleapis.com/www.paydinfull.com/musik/'
// }

export interface IMusicCloudFetcher {

}

export class MusicCloudFetcher implements IMusicCloudFetcher {
    // private static storage: Storage = new Storage()
    // static player = new SoundCloudAudio('TT9Uj7PkasKPYxBlhLNxg2nFm9cLcKmv')

    private constructor() {

    }

    static async initialize() {
        importantLog('MusicCloudFetcher', 'initialize')

        // player.initialize({
        //     client_id: 'TT9Uj7PkasKPYxBlhLNxg2nFm9cLcKmv'
        // })
    }

    // static fetch(bucket: MusicCloudBuckets, resourceUrl: string) {
    static fetch(resourceUrl: string) {
        importantLog('MusicCloudFetcher', 'fetch', 'resourceUrl', resourceUrl)

        // const b = this.storage.bucket(bucket)

        return new Promise((resolve, reject) => {

            resolve(true)
            // this.player.resolve('https://w.soundcloud.com/player/?url=https://soundcloud.com/chrisbjerken/picking-up-the-pieces', (track) => {
            // // 'https://soundcloud.com/user-1921875/meiko-c', (track) => {
            //     loudLog('Loaded sound')

            //     track.play()
            // })

            // this.player.play({
            //     streamUrl: '/tracks/1049631004/stream'
            // }).then((player) => {
            //     // importantLog('MusicCloudFetcher', 'successfully fetched meiko-c')
            //     // song.play()

            //     resolve(true)
            // }).catch((error) => {
            //     reject(error)
            // })

            // b.file(resourceUrl).download((error, contents) => {
            //     importantLog('Download complete', 'error', error, 'contents', contents)
            // })
        })
    }
}
