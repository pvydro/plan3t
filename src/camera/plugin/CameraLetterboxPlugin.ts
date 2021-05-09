import { Graphix, IGraphix } from '../../engine/display/Graphix'
import { UIComponent } from '../../ui/UIComponent'
import { IUIContainer, UIContainer } from '../../ui/UIContainer'
import { GameWindow } from '../../utils/Constants'
import { ICamera } from '../Camera'
import { CameraLayer } from '../CameraStage'

export interface ICameraLetterboxPlugin extends IUIContainer {
    topBox: IGraphix
    bottomBox: IGraphix
}

export class CameraLetterboxPlugin extends UIComponent {
    _bottomBox: Graphix
    _topBox: Graphix
    _boxes: Graphix[]
    boxColor: number = 0x080808

    constructor(camera: ICamera) {
        super()

        this._boxes = [
            this._bottomBox = new Graphix(),
            this._topBox = new Graphix()
        ]

        for (var i in this.boxes) {
            const box = this.boxes[i]

            box.beginFill(this.boxColor)
            box.drawRect(0, 0, GameWindow.fullWindowWidth, GameWindow.topMarginHeight)
            box.endFill()

            this.addChild(box)
        }

        this.reposition(true)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        // Dimensions
        for (var i in this.boxes) {
            const box = this.boxes[i]

            box.height = GameWindow.topMarginHeight
            box.width = GameWindow.fullWindowWidth
        }

        // Position
        this.topBox.y = 0
        this.bottomBox.y = GameWindow.fullWindowHeight - GameWindow.topMarginHeight
    }

    get boxes() {
        return this._boxes
    }

    get topBox() {
        return this.boxes[0]
    }

    get bottomBox() {
        return this.boxes[1]
    }
}
