import { Assets, AssetUrls } from '../asset/Assets'
import { Container } from '../engine/display/Container'
import { Sprite } from '../engine/display/Sprite'
import { Dimension, IDimension } from '../engine/math/Dimension'
import { InputEvents, InputProcessor } from '../input/InputProcessor'
import { IReposition } from '../interface/IReposition'
import { IUpdatable } from '../interface/IUpdatable'
import { log } from '../service/Flogger'
import { GameWindow } from '../utils/Constants'
import { exists } from '../utils/Utils'
import { ICamera, Camera } from './Camera'

export enum CameraStageBackgroundType {
    BlueSky = 'BlueSky',
    Black = 'Blackout'
}

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

export interface ICameraStage extends IUpdatable, IReposition {
    targetX: number
    targetY: number
    setBackground(background: CameraStageBackgroundType): void
}

export interface CameraStageOptions {
    camera: ICamera
}

export class CameraStage extends Container implements ICameraStage {
    _hasAddedResizeListeners: boolean = false
    backgroundDimension: IDimension = new Dimension(0, 0)
    backgroundContainer?: Container
    layers: Container[] = []
    camera: ICamera
    targetX: number = undefined
    targetY: number = undefined

    constructor(options: CameraStageOptions) {
        super()

        this.camera = options.camera
        this.backgroundContainer = new Container()

        this.createLayerContainers()
        this.reposition(true)
    }

    update() {
        if (this.backgroundContainer) {
            const zeroProjected = Camera.Zero
            this.backgroundContainer.x = zeroProjected.x
            this.backgroundContainer.y = zeroProjected.y
        }

        if (exists(this.targetX)) this.x += (this.targetX - this.x) / 20
        if (exists(this.targetY)) this.y += (this.targetY - this.y) / 20
    }

    private createLayerContainers() {
        log('CameraStage', 'createLayerContainers')
        const layerIds = Object.values(CameraLayer)
        
        for (let i = 0; i < layerIds.length; i++) {
            const newContainer = i === 0 ? this.backgroundContainer : new Container()

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

            if (layerContainer === this.backgroundContainer) return

            for (const j in layerChildren) {
                const layerChild = layerChildren[j]

                layerContainer.removeChild(layerChild)
            }
        }
    }

    setBackground(background: CameraStageBackgroundType) {
        log('CameraStage', 'setBackground', 'background', background)

        this.backgroundContainer.clearChildren()

        if (background === CameraStageBackgroundType.BlueSky) {
            const backgroundSprite = new Sprite({
                texture: PIXI.Texture.from(Assets.get(AssetUrls.SkyDawn))
            })

            this.backgroundContainer.addChild(backgroundSprite)
        } else if (background === CameraStageBackgroundType.Black) {
            
        }

        this.reposition()
    }

    reposition(addListener?: boolean) {
        log('CameraStage', 'reposition')

        if (addListener && !this._hasAddedResizeListeners) {
            this._hasAddedResizeListeners = true

            InputProcessor.on(InputEvents.Resize, () => {
                this.reposition(false)
            })
        }

        this.backgroundContainer.width = GameWindow.width
        this.backgroundContainer.height = GameWindow.height
    }
}
