import * as PIXI from 'pixi.js'
import { WeaponName } from './WeaponName'
import { Assets } from '../asset/Assets'
import { Flogger } from '../service/Flogger'
import { WeaponStats } from './Weapon'
const weaponStats = require('../json/WeaponStats.json')

export class WeaponHelper {
    private constructor() {

    }

    public static getWeaponTextureByName(name: WeaponName) {
        Flogger.log('WeaponHelper', 'getWeaponTextureByName', name)

        const details: any = WeaponHelper.getWeaponDetailsByName(name)

        const url = Assets.BASE_IMAGE_DIR + '/weapons/' + details.dir + '/' + name
        const texture = PIXI.Texture.from(Assets.get(url))

        return texture
    }

    public static getWeaponDetailsByName(name: WeaponName): any {
        Flogger.log('WeaponHelper', 'getWeaponDetailsByName', name)

        const data = weaponStats[name]

        return data
    }

    public static getWeaponStatsByName(name: WeaponName): WeaponStats {
        const data = WeaponHelper.getWeaponDetailsByName(name)
        return data as WeaponStats
    }
}
