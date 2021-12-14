import * as PIXI from 'pixi.js'
import { WeaponName } from './WeaponName'
import { Assets } from '../asset/Assets'
import { Flogger } from '../service/Flogger'
import { WeaponStats } from './Weapon'
import { WeaponAttachmentChoice } from './attachments/WeaponAttachment'
import { WeaponAttachmentSlot } from './attachments/WeaponAttachments'
import { FourWayDirection as Direction } from '../engine/math/Direction'
const weaponStats = require('../json/WeaponStats.json')

export class WeaponHelper {
    private static SlotDirectionMap: Map<WeaponAttachmentSlot, Direction> = new Map([
        [WeaponAttachmentSlot.Scope, Direction.Up],
        [WeaponAttachmentSlot.SubSight, Direction.Up],
        [WeaponAttachmentSlot.Underbarrel, Direction.Down],
        [WeaponAttachmentSlot.Grip, Direction.Down],
        [WeaponAttachmentSlot.Stock, Direction.Left]
    ])
    
    private constructor() {

    }

    static getWeaponTextureByName(name: WeaponName, suffix?: string) {
        Flogger.log('WeaponHelper', 'getWeaponTextureByName', name)

        const details: any = WeaponHelper.getWeaponDetailsByName(name)

        const suff = suffix ?? ''
        const url = Assets.BaseImageDir + '/weapons/' + details.dir + '/' + name.toLowerCase() + suff
        const texture = PIXI.Texture.from(Assets.get(url))

        return texture
    }

    static getWeaponUnloadedTextureByName(name: WeaponName) {
        Flogger.log('WeaponHelper', 'getWeaponUnloadedTextureByName', name)

        const texture = WeaponHelper.getWeaponTextureByName(name, '_un')

        return texture
    }

    static getWeaponDetailsByName(name: WeaponName): any {
        Flogger.log('WeaponHelper', 'getWeaponDetailsByName', name)

        const data = weaponStats[name]

        return data
    }

    static getWeaponStatsByName(name: WeaponName): WeaponStats {
        const data = WeaponHelper.getWeaponDetailsByName(name)
        
        return data as WeaponStats
    }

    static getAttachmentTypeUrl(type: WeaponAttachmentSlot) {
        const url = `${ Assets.BaseImageDir }/weapons/attachments/${ type.toLowerCase() }/`
        return url
    }

    static getWeaponAttachmentAsset(choice: WeaponAttachmentChoice) {
        const assetUrl = `${ this.getAttachmentTypeUrl(choice.slot) }${ choice.name.toLowerCase() }`
        const asset = Assets.get(assetUrl)
        return asset
    }

    static getDirectionForSlot(slot: WeaponAttachmentSlot) {
        const direction = WeaponHelper.SlotDirectionMap.get(slot)

        return direction
    }
}
