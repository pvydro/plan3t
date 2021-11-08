import { IClientEntity } from '../../cliententity/ClientEntity'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IVector2 } from '../../engine/math/Vector2'
import { Constants, DebugConstants } from '../../utils/Constants'
import { ICamera } from '../Camera'

export interface ICameraServerDebugPlugin {
}

export class CameraServerDebugPlugin extends Container implements ICameraServerDebugPlugin {
    debugEntities: Map<string, IClientEntity> = new Map()  // ID, serverposition
    debugGraphics: Map<string, Graphix> = new Map()

    constructor(camera: ICamera) {
        super()
    
        // this.debugPoints
    }

    update() {
        this.debugEntities.forEach((entity: IClientEntity, id: string) => {
            const serverPos: IVector2 = {
                x: entity.targetServerPosition.x ?? entity.x,
                y: entity.targetServerPosition.y ?? entity.y
            }

            this.debugGraphics.get(id).position.set(serverPos.x, serverPos.y)
        })
    }

    trackEntity(clientEntity: IClientEntity) {
        if (!DebugConstants.ShowServerPositions) return

        const debugGraphic = this.createDebugGraphic()

        this.addChild(debugGraphic)
        
        this.debugEntities.set(clientEntity.entityId, clientEntity)
        this.debugGraphics.set(clientEntity.entityId, debugGraphic)
    }

    untrackEntity(clientEntity: IClientEntity) {
        const debugGraphic = this.debugGraphics.get(clientEntity.entityId)

        this.removeChild(debugGraphic)

        this.debugGraphics.delete(clientEntity.entityId)
        this.debugEntities.delete(clientEntity.entityId)
    }

    private createDebugGraphic(color?: number) {
        const g = new Graphix()
        color = color || 0xffffff

        g.beginFill(color)
        g.drawCircle(0, 0, 2)
        g.endFill()
        g.alpha = 0.5

        return g
    }
}
