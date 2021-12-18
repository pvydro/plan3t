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
                style: TextStyles.DefaultButton.Small,
                color: 0xffffff
            },
            background: {
                idle: AssetUrls.ButtonSlot
            },
            darkenerOptions: {
                shouldDarken: true
            }
        })
    }
}
