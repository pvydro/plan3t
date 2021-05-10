import { Assets, AssetUrls } from '../../../../asset/Assets'
import { Sprite } from '../../../../engine/display/Sprite'
import { INature, Nature, NatureOptions } from '../Nature'

export interface ITree extends INature {

}

export interface TreeOptions extends NatureOptions {
    treeUrl?: string
}

export class Tree extends Nature implements ITree {
    sprite: Sprite
    
    constructor(options?: TreeOptions) {
        super(options)

        const url = options.treeUrl ?? AssetUrls.TreeDefault
        const texture = PIXI.Texture.from(Assets.get(url))
        
        this.sprite = new Sprite({ texture })
        this.sprite.anchor.set(0.5, 1)
        this.addChild(this.sprite)
    }
}
