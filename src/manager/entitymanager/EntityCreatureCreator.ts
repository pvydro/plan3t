import { CameraLayer } from '../../camera/CameraStage'
import { Creature } from '../../creature/Creature'
import { CreatureType } from '../../creature/CreatureType'
import { CreatureFactory } from '../../factory/CreatureFactory'
import { camera, entityMan } from '../../shared/Dependencies'
import { EntityCreatorOptions } from './EntityManager'

export interface IEntityCreatureCreator {
    createCreature(id: string, options: CreatureCreationOptions): Creature
}

export interface CreatureCreationOptions extends EntityCreatorOptions {
    type: CreatureType
}

export class EntityCreatureCreator implements IEntityCreatureCreator {

    constructor() {
    }

    createCreature(id: string, options: CreatureCreationOptions) {
        const creature = CreatureFactory.createCreatureForType(options.type)

        creature.entityId = id
        creature.x = options.schema.x ?? 0
        creature.y = options.schema.y ?? 0

        camera.stage.addChildAtLayer(creature, CameraLayer.Creatures)
        entityMan.registerEntity(id, {
            clientEntity: creature,
            serverEntity: options.schema
        })

        return creature
    }
}
