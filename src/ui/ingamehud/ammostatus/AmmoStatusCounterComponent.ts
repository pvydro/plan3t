import { Container } from '../../../engine/display/Container'
import { Graphix } from '../../../engine/display/Graphix'
import { IWeapon } from '../../../weapon/Weapon'
import { UIComponent } from '../../UIComponent'
import { AmmoStatusComponent, IAmmoStatusComponent } from './AmmoStatusComponent'

export interface IAmmoStatusCounterComponent {

}

export interface AmmoStatusCounterComponentOptions {
    parent: AmmoStatusComponent
}

export class AmmoStatusCounterComponent extends UIComponent implements IAmmoStatusCounterComponent {
    statusComponent: AmmoStatusComponent
    currentWeapon: IWeapon
    counterHeight: number = 4
    counterContainer: Container
    totalCounters: number
    counters: Graphix[]

    constructor(options: AmmoStatusCounterComponentOptions) {
        super()

        this.statusComponent = options.parent
        this.counterContainer = new Container()
        this.addChild(this.counterContainer)

        this.reposition(true)
    }

    update() {

    }

    setWeapon(weapon: IWeapon) {
        this.currentWeapon = weapon

        this.reconfigureCounters()
    }

    reconfigureCounters() {
        const counterSpacing = 1
        let alphaIncrement = 0

        this.totalCounters = this.currentWeapon.bulletsPerClip

        // Kill current counters
        for (var c in this.counters) {
            const currentCounter = this.counters[c]

            currentCounter.demolish()

            delete this.counters[c]
        }

        this.counters = []

        // Create new counters
        for (var i = 0; i < this.totalCounters; i++) {
            const counter = new Graphix()
            const counterAlphaBreakpoint = 5

            counter.beginFill(0xFFFFFF)
            counter.drawRect(0, 0, 1, this.counterHeight)
            counter.endFill()
            counter.x = (counter.width + counterSpacing) * i
            counter.alpha = 0.75
            
            if (i > counterAlphaBreakpoint) {
                alphaIncrement += 0.1
                counter.alpha -= alphaIncrement
            }

            this.counterContainer.addChild(counter)
            this.counters.push(counter)
        }
    }

    reposition(addListeners: boolean) {
        super.reposition(addListeners)

        const leftPadding = 8

        this.counterContainer.x = leftPadding
        this.counterContainer.y = (this.statusComponent.backgroundSprite.height / 2)
            - (this.counterHeight / 2)
    }
}
