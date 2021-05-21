import { Assets } from '../../asset/Assets'
import { MapBuildingType } from './MapBuilding'

export class MapBuildingHelper {
    private constructor() {
        
    }

    static getBackgroundUrlForType(type: MapBuildingType): PIXI.Texture {
        const url = Assets.BaseImageDir + '/' + type + '/background'

        return PIXI.Texture.from(Assets.get(url))
    }

    static getFloorAssetForType(type: MapBuildingType): PIXI.Texture {
        const url = Assets.BaseImageDir + '/' + type + 'platform'
        
        return PIXI.Texture.from(Assets.get(url))
    }
}
