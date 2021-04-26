import { ClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { CreatureType } from '../../creature/Creature'
import { CreatureFactory } from '../../factory/CreatureFactory'
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
    }

    spawn() {
        const type = this.typeToSpawn
        log('CreatureSpawner', 'spawn', 'type', type)
        const player = ClientPlayer.getInstance()
        const x = player.x
        const y = player.y - 128
        const creature = CreatureFactory.createCreatureForType(type)

        creature.pos = { x, y }
        
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
