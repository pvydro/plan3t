import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Container } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { WeaponHelper } from '../../../weapon/WeaponHelper'
import { AdjustmentFilter } from 'pixi-filters'
import { WindowSize } from '../../../utils/Constants'
import { IReposition } from '../../../interface/IReposition'
import { UIComponent } from '../../UIComponent'
import { Defaults } from '../../../utils/Defaults'

export interface IWeaponHint extends IReposition {

}

export class WeaponHint extends UIComponent implements IWeaponHint {
    primaryWeaponSprite?: Sprite
    secondaryWeaponSprite?: Sprite
    weaponContainer: Container
    leftPadding: number = 8

    constructor() {
        super()
        
        this.weaponContainer = new Container()
        this.addChild(this.weaponContainer)
    }

    configure(player: ClientPlayer | undefined) {
        if (this.primaryWeaponSprite) this.weaponContainer.removeChild(this.primaryWeaponSprite)
        if (this.secondaryWeaponSprite) this.weaponContainer.removeChild(this.secondaryWeaponSprite)

        const loadout = player ? player.holster.currentLoadout : undefined

        if (player === undefined || loadout === undefined) {
            // TODO empty graphic logic
            return
        }

        const primaryWeaponTexture = loadout.primaryWeaponName
            ? WeaponHelper.getWeaponTextureByName(loadout.primaryWeaponName)
            : PIXI.Texture.EMPTY
        const secondaryWeaponTexture = loadout.secondaryWeaponName
            ? WeaponHelper.getWeaponTextureByName(loadout.secondaryWeaponName)
            : PIXI.Texture.EMPTY

        this.primaryWeaponSprite = new Sprite({ texture: primaryWeaponTexture })
        this.secondaryWeaponSprite = new Sprite({ texture: secondaryWeaponTexture })
        this.primaryWeaponSprite.anchor.set(1, 1)
        this.secondaryWeaponSprite.anchor.set(1, 0)

        this.weaponContainer.addChild(this.primaryWeaponSprite)
        this.weaponContainer.addChild(this.secondaryWeaponSprite)

        this.initializeEffects()
        this.reposition(true)
    }

    initializeEffects() {
        const weaponSprites = [ this.primaryWeaponSprite, this.secondaryWeaponSprite ]

        for (let i in weaponSprites) {
            const sprite = weaponSprites[i]
            const adjustmentFilter = new AdjustmentFilter({
                brightness: 5,
                contrast: 0,
            })

            sprite.filters = [ adjustmentFilter ]
        }
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const newX = WindowSize.width / Defaults.UIScale

        this.weaponContainer.x = newX - this.leftPadding - (Defaults.UIEdgePadding / Defaults.UIScale)
    }
}
