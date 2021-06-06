import { Assets, AssetUrls } from '../../asset/Assets'
import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { MapBuildingType } from './MapBuilding'

export interface IMapBuildingBackground extends IContainer {

}

export interface MapBuildingBackgroundOptions {
    type: MapBuildingType
}

export class MapBuildingBackground extends Container {
    type: MapBuildingType
    backgroundSprites: Sprite[] = []

    constructor(options: MapBuildingBackgroundOptions) {
        super()
        
        // const texture = PIXI.Texture.from(Assets.get(Assets.MapBuildingDir + 'dojo/background/1'))
        // const spr = new Sprite({ texture })
        
        this.type = options.type
        // this.addChild(spr)

        this.constructBackgroundTiles()
    }

    constructBackgroundTiles() {
        const totalSprites = 3

        for (var i = 0; i < totalSprites; i++) {
            const url = Assets.MapBuildingDir + this.type + '/background/1'
            const texture = PIXI.Texture.from(Assets.get(url))
            const spr = new Sprite({ texture })
            const lastSpr = this.backgroundSprites[i - 1]

            if (lastSpr) {
                spr.x = lastSpr.x + lastSpr.width
            }

            this.backgroundSprites.push(spr)
            this.addChild(spr)
        }

        // for (var j in this.backgroundSprites) {
        //     const spr = this.backgroundSprites[j]
        //     const lastSpr = this.backgroundSprites[j - 1]

        //     this.addChild(spr)
        // }
    }
}
