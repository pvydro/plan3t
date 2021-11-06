import { TextStyles } from '../../../engine/display/TextStyles'
import { UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface IVersionInfoComponent {
}

export class VersionInfoComponent extends UIComponent implements IVersionInfoComponent {
    text: UIText

    constructor() {
        super()

        this.text = new UIText({
            text: 'Version: ...',
            style: TextStyles.Menu.HeaderSmaller,
            uppercase: true
        })

        import('../../../../package.json').then(({ version }) => {
            this.text.setText(`Version: ${version}`)
        })

        this.addChild(this.text)
    }
}
