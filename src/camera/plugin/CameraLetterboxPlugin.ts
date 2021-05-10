import { RectGradient } from '../../engine/display/extra/RectGradient'
import { Graphix, IGraphix } from '../../engine/display/Graphix'
import { FourWayDirection } from '../../engine/math/Direction'
import { UIComponent } from '../../ui/UIComponent'
import { IUIContainer, UIContainer } from '../../ui/UIContainer'
import { GameWindow } from '../../utils/Constants'
import { UIDefaults } from '../../utils/Defaults'
import { rect } from '../../utils/Utils'
import { ICamera } from '../Camera'
import { CameraLayer } from '../CameraStage'

export interface ICameraLetterboxPlugin extends IUIContainer {
    topBox: IGraphix
    bottomBox: IGraphix
}

export class CameraLetterboxPlugin extends UIComponent {
    // _topBox: Graphix
    // _bottomBox: Graphix
    // _topRectGradient: RectGradient
    // _bottomRectGradient: RectGradient
    _boxes: Graphix[]
    _gradients: RectGradient[]
    boxColor: number = 0x080808

    constructor(camera: ICamera) {
        super({ filters: UIDefaults.UIScreenDefaultFilters })

        const windowWidth = GameWindow.fullWindowWidth
        const gradientRect = rect(0, 0, GameWindow.fullWindowWidth, 24)

        // this._topRectGradient = 
        // this._bottomRectGradient = new RectGradient({
        //     definition: { rect: gradientRect, direction: FourWayDirection.Up }
        // })
        this._gradients = [
            new RectGradient({ definition: { rect: gradientRect, direction: FourWayDirection.Down } }),
            new RectGradient({ definition: { rect: gradientRect, direction: FourWayDirection.Up } })
        ]
        this._boxes = [ new Graphix(), new Graphix() ]

        for (var i in this.boxes) {
            const box = this.boxes[i]

            box.beginFill(this.boxColor)
            box.drawRect(0, 0, windowWidth, GameWindow.topMarginHeight)
            box.endFill()

            this.addChild(box)
        }

        this.addChild(this.topRectGradient)
        this.addChild(this.bottomRectGradient)
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
        for (var i in this.gradients) {
            const gradient = this.gradients[i]
            gradient.width = GameWindow.fullWindowWidth
        }

        // Position
        this.topBox.y = 0
        this.bottomBox.y = GameWindow.fullWindowHeight - GameWindow.topMarginHeight
        this.topRectGradient.y = GameWindow.topMarginHeight
        this.bottomRectGradient.y = GameWindow.fullWindowHeight - GameWindow.topMarginHeight - this.bottomRectGradient.height
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

    get gradients() {
        return this._gradients
    }

    get topRectGradient() {
        return this._gradients[0]
    }

    get bottomRectGradient() {
        return this._gradients[1]
    }
}
