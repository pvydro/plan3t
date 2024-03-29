import { Key } from 'ts-keycode-enum'
import { Camera } from '../../camera/Camera'
import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { CreatureType } from '../../creature/CreatureType'
import { Direction } from '../../engine/math/Direction'
import { IVector2 } from '../../engine/math/Vector2'
import { CreatureFactory } from '../../factory/CreatureFactory'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { SpawnPointManager } from '../../manager/spawnpointmanager/SpawnPointManager'
import { log } from '../../service/Flogger'
import { isArray } from '../../utils/Utils'
import { ISpawner, Spawner, SpawnerOptions } from '../Spawner'

export interface ICreatureSpawner extends ISpawner {

}

export interface CreatureSpawnerOptions extends SpawnerOptions {
    typeToSpawn: CreatureType | CreatureType[]
}

export class CreatureSpawner extends Spawner implements ICreatureSpawner {
    _typeToSpawn: CreatureType | CreatureType[]

    constructor(options: CreatureSpawnerOptions) {
        super(options)

        this._typeToSpawn = options.typeToSpawn

        InputProcessor.on(InputEvents.KeyDown, (event: KeyboardEvent) => {
            if (event.which === Key.M) {
                this.spawn()
            }
        })
    }

    spawn() {
        log('CreatureSpawner', 'spawn', 'type', this.typeToSpawn)
        
        const type = this.typeToSpawn
        const creature = CreatureFactory.createCreatureForType(type)

        creature.pos = SpawnPointManager.getEnemySpawnPoint()
        
        super.spawn(creature)
    }

    /**
     * Returns a random type based on the list provided via options
     * 
     * TODO: Multi-type spawning w/ randomization & configuration
     */
    get typeToSpawn() {
        const chosenType = isArray(this._typeToSpawn)
            ? this._typeToSpawn[0] : this._typeToSpawn

        return (chosenType as CreatureType)
    }
}
