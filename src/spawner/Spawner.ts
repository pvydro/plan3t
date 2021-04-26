import { ClientEntity } from '../cliententity/ClientEntity'
import { EntityManager } from '../manager/entitymanager/EntityManager'
import { Events } from '../model/events/Events'
import { log } from '../service/Flogger'
import { Emitter } from '../utils/Emitter'
import { exists, functionExists } from '../utils/Utils'

export interface ISpawner {
    spawn(): void
    onSpawn?: Function
}

export interface SpawnerOptions {
    onSpawn?: Function
}

export class Spawner extends Emitter implements ISpawner {
    _onSpawn?: Function

    constructor(options: SpawnerOptions) {
        super()

        if (exists(options)) {
            if (functionExists(options.onSpawn)) {
                this._onSpawn = options.onSpawn
            }
        }
    }

    spawn(entity?: ClientEntity) {
        log('Spawner', 'spawn')

        this.emit(Events.Spawn)

        if (this._onSpawn !== undefined) {
            this._onSpawn(entity)
        }
    }

    private findSpawnLocation() { // TODO: This

    }

    set onSpawn(value: Function) {
        this._onSpawn = value
    }

    get onSpawn() {
        return this._onSpawn
    }
}
