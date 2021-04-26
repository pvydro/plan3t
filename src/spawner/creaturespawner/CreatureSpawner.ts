import { CreatureType } from '../../creature/Creature'
import { log } from '../../service/Flogger'
import { ISpawner, Spawner, SpawnerOptions } from '../Spawner'

export interface ICreatureSpawner extends ISpawner {

}

export interface CreatureSpawnerOptions extends SpawnerOptions {
    typeToSpawn: CreatureType | CreatureType[]
}

export class CreatureSpawner extends Spawner implements ICreatureSpawner {
    constructor() {
        super()
    }

    spawn() {
        log('Spawner', 'spawn')

        super.spawn()
    }
}
