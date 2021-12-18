import { AssetUrls } from '../../../asset/Assets'
import { TextSpriteAlign } from '../../../engine/display/TextSprite'
import { TextStyles } from '../../../engine/display/TextStyles'
import { WeaponAttachmentStats } from '../../../weapon/attachments/WeaponAttachment'
import { IUIButton, UIButton, UIButtonType } from '../../uibutton/UIButton'

export interface IAttachmentListCell extends IUIButton {

}

export interface AttachmentListCellOptions extends WeaponAttachmentStats {

}

export class AttachmentListCell extends UIButton {
    constructor(options: AttachmentListCellOptions) {
        super({
            type: UIButtonType.Tap,
            text: {
                text: options.name,
                align: TextSpriteAlign.Left,
                uppercase: true,
                offsetY: -3,
                alpha: 0.5,
                style: TextStyles.MetalButton.Medium,
            },
            background: {
                idle: AssetUrls.ButtonMetalMd,
                hovered: AssetUrls.ButtonRectDefaultHovered
            },
        })
    }
}
