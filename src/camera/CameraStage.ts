import { Container } from '../engine/display/Container'
import { log } from '../service/Flogger'
import { ICamera } from './Camera'

let layerIndex = 0
export const CameraLayer = {
    GameMapSky: layerIndex++,
    Background: layerIndex++,
    GameMapBackground: layerIndex++,
    GameMap: layerIndex++,
    Bullet: layerIndex++,
    Particle: layerIndex++,
    Players: layerIndex++,
    Creatures: layerIndex++,
    Lighting: layerIndex++,
    GameMapOverlay: layerIndex++,
    Overlay: layerIndex++,
    Tooltips: layerIndex++,
    OverlayParticle: layerIndex++,
    DebugOverlay: layerIndex++
}

export interface ICameraStage {

}

export interface CameraStageOptions {
    camera: ICamera
}

export class CameraStage extends Container implements ICameraStage {
    layers: Container[] = []
    camera: ICamera

    constructor(options: CameraStageOptions) {
        super()

        this.camera = options.camera

        this.createLayerContainers()
    }

    private createLayerContainers() {
        log('CameraStage', 'createLayerContainers')

        const layerIds = Object.values(CameraLayer)

        for (let i = 0; i < layerIds.length; i++) {
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

        for (const i in this.layers) {
            const layerContainer = this.layers[i]
            const layerChildren = layerContainer.children

            for (const j in layerChildren) {
                const layerChild = layerChildren[j]

                if (child === layerChild) {
                    parentLayer = i
                }
            }
        }

        return parentLayer
    }

    /**
     * Remove child from each layer one by one
     */
    clearChildren() {
        log('CameraStage', 'clearChildren')

        for (const i in this.layers) {
            const layerContainer = this.layers[i]
            const layerChildren = layerContainer.children

            // layerContainer.clearChildren()

            for (const j in layerChildren) {
                const layerChild = layerChildren[j]

                layerContainer.removeChild(layerChild)
                // layerChild.destroy()
            }
        }
    }
}
