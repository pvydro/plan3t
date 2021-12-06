import { IClientEntity } from '../../cliententity/ClientEntity'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IDimension } from '../../engine/math/Dimension'
import { IVector2 } from '../../engine/math/Vector2'
import { DebugConstants } from '../../utils/Constants'
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
            const serverDimension: IDimension = {
                width: entity.targetServerDimension.width ?? entity.width,
                height: entity.targetServerDimension.height ?? entity.height
            }

            this.debugGraphics.get(id).x = serverPos.x - (serverDimension.width / 2)
            this.debugGraphics.get(id).y = serverPos.y - (serverDimension.height / 2)
            this.debugGraphics.get(id).width = serverDimension.width
            this.debugGraphics.get(id).height = serverDimension.height
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
        const serverEntityGraphic = new Graphix()
        // const serverDim = new Graphix()
        color = color || 0xffffff

        serverEntityGraphic.beginFill(color)
        // serverEntityGraphic.drawCircle(0, 0, 2)
        serverEntityGraphic.drawRect(0, 0, 2, 2)
        serverEntityGraphic.endFill()
        serverEntityGraphic.alpha = 0.5

        return serverEntityGraphic
    }
}
