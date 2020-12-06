import * as PIXI from 'pixi.js'
import { WeaponName } from './WeaponName'
import { Assets, AssetUrls } from '../asset/Assets'

export class WeaponHelper {
    private constructor() {

    }

    public static getWeaponTextureByName(name: WeaponName) {
        const url = AssetUrls.BASE_IMAGE_DIR + name + '.png'
        const texture = PIXI.Texture.from(Assets.get(url))
        
        return texture
    }
}
