import { Container } from '../engine/display/Container'
import { Flogger } from '../service/Flogger'
import { ICamera } from './Camera'

export const CameraLayer = {
    Background: 0,
    GameMapBackground: 1,
    GameMap: 2,
    Bullet: 3,
    Particle: 4,
    Players: 5,
    Lighting: 6,
    GameMapOverlay: 7,
    Overlay: 8
}

export interface ICameraStage {

}

export class CameraStage extends Container implements ICameraStage {
    layers: Container[] = []
    camera: ICamera

    constructor(camera: ICamera) {
        super()

        this.camera = camera

        this.createLayerContainers()
    }

    private createLayerContainers() {
        Flogger.log('CameraStage', 'createLayerContainers')

        const layerIds = Object.values(CameraLayer)

        for (var i = 0; i < layerIds.length; i++) {
            const newContainer = new Container()

            this.layers.push(newContainer)
            this.addChildAt(newContainer, i)
        }
    }

    addChildAtLayer(child: PIXI.DisplayObject, layer: number) {
        if (layer > this.layers.length) {
            throw new Error('Tried to add child at layer that doesn\'t exist.')
        }

        child['layer'] = layer
        const layerContainer = this.layers[layer]

        layerContainer.addChild(child)
    }

    removeFromLayer(child: PIXI.DisplayObject, layer?: number) {
        if (layer !== undefined) {
            this.layers[layer].removeChild(child)

            return
        } else if (child['layer'] !== undefined) {
            return this.removeFromLayer(child, child['layer'])
        } else {
            const foundLayer = this.findParentLayer(child)

            if (foundLayer == undefined) {
                this.removeChild(child)
            } else {
                return this.removeFromLayer(child, foundLayer)
            }
        }
    }

    findParentLayer(child: any): number | undefined {
        let parentLayer = undefined

        for (var i in this.layers) {
            const layerContainer = this.layers[i]
            const layerChildren = layerContainer.children

            for (var j in layerChildren) {
                const layerChild = layerChildren[j]

                if (child === layerChild) {
                    parentLayer = i
                }
            }
        }

        return parentLayer
    }
}
