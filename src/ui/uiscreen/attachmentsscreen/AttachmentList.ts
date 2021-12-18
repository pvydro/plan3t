import { TextStyles } from '../../../engine/display/TextStyles'
import { UIDefaults } from '../../../utils/Defaults'
import { WeaponAttachmentStats } from '../../../weapon/attachments/WeaponAttachment'
import { WeaponAttachmentSlot } from '../../../weapon/attachments/WeaponAttachments'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIContainer } from '../../UIContainer'
import { UIText } from '../../UIText'
import { AttachmentListCell, IAttachmentListCell } from './AttachmentListCell'
import { IAttachmentsScreen } from './AttachmentsScreen'
const attachmentStats = require('../../../json/AttachmentStats.json')

export interface IAttachmentList extends IUIComponent {

}

export interface AttachmentListOptions {
    screen: IAttachmentsScreen
}

export class AttachmentList extends UIComponent implements IAttachmentList {
    screen: IAttachmentsScreen
    header: UIText
    cells: IAttachmentListCell[] = []
    cellContainer: UIContainer

    constructor(options: AttachmentListOptions) {
        super()

        this.screen = options.screen
        this.cellContainer = new UIContainer()
        this.header = new UIText({
            text: 'Available',
            uppercase: true,
            style: TextStyles.Menu.HeaderSmall
        })

        this.addChild(this.header)
        this.addChild(this.cellContainer)

        this.forceHide()
    }

    reposition() {
        super.reposition()

        const padding = UIDefaults.UIMargin
        
        this.x = this.screen.selectedAttachmentText.x
        this.y = this.screen.selectedAttachmentText.y
            + this.screen.selectedAttachmentText.height + padding
    }

    async show() {
        if (this.isShown) await this.hide()

        if (this.cells.length > 0) this.clearCells()

        this.createCells()

        return super.show()
    }

    createCells() {
        const slot: WeaponAttachmentSlot = this.screen.selectedAttachmentNode?.slot
        const attachmentsOfSameSlot = Object.values(attachmentStats).filter((stats: any) => stats.slot === slot)
        const margin = UIDefaults.UIMargin

        attachmentsOfSameSlot.forEach((attachment: any, i: number) => {
            const attachmentDetails = (attachment as WeaponAttachmentStats)
            const cell = new AttachmentListCell(attachmentDetails)
            cell.y = (cell.height + margin) * i

            this.cellContainer.addChild(cell)

            console.log(attachmentDetails)
        })
        // const allOfSameSlot = //this.screen.selectedAttachmentNode?.weapon.attachments.filter(attachment => attachment.slot === slot)
    }

    clearCells() {
        this.cells.forEach(cell => {
            this.removeChild(cell)
            cell.demolish()
        })
        this.cells = []
    }
}
