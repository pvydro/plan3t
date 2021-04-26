import { Events } from '../model/events/Events'
import { log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { exists } from '../utils/Utils'

export interface ISpawner {
    spawn(): void
}

export interface SpawnerOptions {
    onSpawn?: Function
}

export class Spawner extends Emitter implements ISpawner {
    _onSpawn?: Function

    constructor(options?: SpawnerOptions) {
        super()

        if (exists(options)) {
            if (exists(options.onSpawn)) {
                this._onSpawn = options.onSpawn
            }
        }

        this.on(Events.Spawn, () => {
            console.log('%cSpawnerSpawn', 'font-size: 400%; background-color: red;')
        })
    }

    spawn() {
        log('Spawner', 'spawn')

        this.emit(Events.Spawn)
        this._onSpawn()
    }

    private findSpawnLocation() { // TODO: This

    }
}
