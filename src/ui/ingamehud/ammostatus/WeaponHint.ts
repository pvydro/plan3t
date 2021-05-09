import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Container } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { WeaponHelper } from '../../../weapon/WeaponHelper'
import { AdjustmentFilter } from 'pixi-filters'
import { GameWindow } from '../../../utils/Constants'
import { IReposition } from '../../../interface/IReposition'
import { UIComponent } from '../../UIComponent'
import { Defaults } from '../../../utils/Defaults'
import { IAmmoStatusComponent } from './AmmoStatusComponent'

export interface IWeaponHint extends IReposition {

}

export interface WeaponHintOptions {
    ammoStatus: IAmmoStatusComponent
}

export class WeaponHint extends UIComponent implements IWeaponHint {
    ammoStatus: IAmmoStatusComponent
    primaryWeaponSprite?: Sprite
    secondaryWeaponSprite?: Sprite
    weaponContainer: Container

    constructor(options: WeaponHintOptions) {
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
        this.secondaryWeaponSprite.alpha = 0
        // this.primaryWeaponSprite.anchor.set(1, 1)
        // this.secondaryWeaponSprite.anchor.set(1, 0)

        this.weaponContainer.addChild(this.primaryWeaponSprite)
        this.weaponContainer.addChild(this.secondaryWeaponSprite)

        this.initializeEffects()
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

        console.log('%cRepositioN!', 'background-color: red; font-size: 300%')

        const leftPadding = 5
        const windowHeight = (GameWindow.height / Defaults.UIScale)

        // this.weaponContainer.x =  - rightPadding
        //  - (Defaults.UIEdgePadding / uiScale)
        this.weaponContainer.x = leftPadding
        // this.weaponContainer.y = -this.weaponContainer.height
    }
}
