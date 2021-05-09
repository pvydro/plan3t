import { Graphix } from '../../engine/display/Graphix'
import { IUIContainer, UIContainer } from '../../ui/UIContainer'
import { WindowSize } from '../../utils/Constants'
import { ICamera } from '../Camera'
import { CameraLayer } from '../CameraStage'

export interface ICameraLetterboxPlugin extends IUIContainer {

}

export class CameraLetterboxPlugin extends UIContainer {
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
            box.drawRect(0, -WindowSize.topMarginHeight, WindowSize.fullWindowWidth, WindowSize.topMarginHeight)
            box.endFill()

            this.addChild(box)
        }
        
        // Position bottom box
        this.boxes[1].y = WindowSize.height + WindowSize.topMarginHeight
    }

    get boxes() {
        return this._boxes
    }
}
