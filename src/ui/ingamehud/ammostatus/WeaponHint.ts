import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Container } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { WeaponHelper } from '../../../weapon/WeaponHelper'
import { AdjustmentFilter, DotFilter, OutlineFilter } from 'pixi-filters'

export interface IWeaponHint {

}

export class WeaponHint extends Container implements IWeaponHint {
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
        this.primaryWeaponSprite.anchor.set(0, 1)
        this.primaryWeaponSprite.anchor.set(0, 1)

        this.weaponContainer.addChild(this.primaryWeaponSprite)
        this.weaponContainer.addChild(this.secondaryWeaponSprite)

        this.initalPosition()
    }

    initalPosition() {
        const weaponSprites = [ this.primaryWeaponSprite, this.secondaryWeaponSprite ]

        this.weaponContainer.x = this.leftPadding

        for (var i in weaponSprites) {
            const sprite = weaponSprites[i]
            const outlineColor = 0x000000
            const adjustmentFilter = new AdjustmentFilter({
                brightness: 5,
                contrast: 0
            })

            sprite.filters = [ 
                adjustmentFilter, 
                // outlineFilter
            ]

            sprite.scale.set(0.5, 0.5)
        }
    }
}
