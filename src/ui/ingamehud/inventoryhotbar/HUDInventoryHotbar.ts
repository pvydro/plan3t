import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Container } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'
import { ClientPlayerInventory } from '../../../inventory/ClientPlayerInventory'
import { IPlayerInventory } from '../../../inventory/PlayerInventory'
import { UIConstants } from '../../../utils/Constants'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { HUDInventoryHotbarSlot } from './HUDInventoryHotbarSlot'

export interface IHUDInventoryHotbar extends IUIComponent {

}

export class HUDInventoryHotbar extends UIComponent implements IHUDInventoryHotbar {
    backgroundSprite: Sprite
    playerInventory: IPlayerInventory
    slotContainer: Container
    hotbarSlots: HUDInventoryHotbarSlot[] = []

    constructor() {
        super()

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.HOTBAR_BG))

        this.playerInventory = new ClientPlayerInventory.getInstance()
        this.backgroundSprite = new Sprite({ texture })
        this.slotContainer = new Container()

        this.addChild(this.backgroundSprite)
        this.addChild(this.slotContainer)

        this.setupHotbarSlots()
        this.reposition(true)
    }

    setupHotbarSlots() {
        const hotbarInventory = this.playerInventory.hotbarInventory ?? { maximumSlots: 8 }
        const maximumSlots = hotbarInventory.maximumSlots

        if (maximumSlots !== undefined) {
            for (var i = 0; i < maximumSlots; i++) {
                const slot = new HUDInventoryHotbarSlot({
                    hotbarKey: i + 1
                })

                this.hotbarSlots.push(slot)
                this.slotContainer.addChild(slot)
            }
        }
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const padding = UIConstants.HUDPadding

        this.x = padding
        this.y = padding
        this.slotContainer.x = 5
        this.slotContainer.y = 5

        for (var i = 0; i < this.hotbarSlots.length; i++) {
            const slot = this.hotbarSlots[i]
            const spacing = 1
            const spacingTotal = (slot.borderWidth + spacing)

            slot.x = spacingTotal * i
        }
    }
}
