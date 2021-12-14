import { Container, IContainer } from '../../engine/display/Container'
import { WeaponAttachmentConfig } from './WeaponAttachments'

export interface IWeaponAttachment extends IContainer {
}

export class WeaponAttachment extends Container implements IWeaponAttachment {
    constructor(config: WeaponAttachmentConfig) {
        super()

        this.applyConfig(config)
    }

    private applyConfig(config: WeaponAttachmentConfig) {
        this.x = config.x
        this.y = config.y
    }
}