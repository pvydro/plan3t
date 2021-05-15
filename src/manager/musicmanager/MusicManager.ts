export interface IMusicManager {

}

export class MusicManager implements IMusicManager {
    private static Instance: IMusicManager

    static getInstance(): IMusicManager {
        if (!this.Instance) {
            this.Instance = new MusicManager()
        }

        return this.Instance
    }

    private constructor() {

    }
}
