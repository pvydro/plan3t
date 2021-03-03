import { Container } from '../../../engine/display/Container'
import { Graphix } from '../../../engine/display/Graphix'
import { Tween } from '../../../engine/display/tween/Tween'
import { Easing } from '../../../engine/display/tween/TweenEasing'
import { IWeapon } from '../../../weapon/Weapon'
import { UIComponent } from '../../UIComponent'
import { AmmoStatusComponent } from './AmmoStatusComponent'

export interface IAmmoStatusCounterComponent {
    
}

export interface AmmoStatusCounterComponentOptions {
    parent: AmmoStatusComponent
}

export class AmmoStatusCounterComponent extends UIComponent implements IAmmoStatusCounterComponent {
    statusComponent: AmmoStatusComponent
    currentWeapon?: IWeapon
    counterHeight: number = 4
    counterContainer: Container
    totalCounters: number
    aliveCounters: number
    counters: Graphix[]

    constructor(options: AmmoStatusCounterComponentOptions) {
        super()

        this.statusComponent = options.parent
        this.counterContainer = new Container()
        this.addChild(this.counterContainer)

        this.reposition(true)
    }

    update() {
        if (this.currentWeapon !== undefined) {
            if (this.currentWeapon.currentClipBullets < this.aliveCounters) {
                const distance = this.aliveCounters - this.currentWeapon.currentClipBullets

                this.aliveCounters--
                const finalCounter = this.counters[this.aliveCounters]

                if (!finalCounter) return

                finalCounter.alpha = 0

                if (distance == 1) {
                    this.highlightCounter(finalCounter)
                }
            } else if (this.currentWeapon.currentClipBullets > this.aliveCounters) {
                this.reconfigureCounters(true)
            }
        }
    }

    setWeapon(weapon: IWeapon) {
        if (this.currentWeapon !== weapon) {
            this.currentWeapon = weapon
    
            this.reconfigureCounters()
        }
    }

    reconfigureCounters(showVisual?: boolean) {
        this.totalCounters = this.currentWeapon.bulletsPerClip
        this.aliveCounters = this.totalCounters

        // Kill current counters
        for (var c in this.counters) {
            const currentCounter = this.counters[c]

            currentCounter.demolish()

            delete this.counters[c]
        }

        this.instantiateAllCounters()

        // Visual feedback
        if (showVisual) {
            const finalCounter = this.counters[this.counters.length - 1]

            this.highlightCounter(finalCounter)
        }
    }

    private instantiateAllCounters() {
        const counterSpacing = 1
        let alphaIncrement = 0
        this.counters = []

        // Create new counters
        for (var i = 0; i < this.totalCounters; i++) {
            const counter = new Graphix()
            const counterAlphaBreakpoint = 8

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

    highlightCounter(counter: Graphix) {
        counter.alpha = 0.75

        const counterFadeAnim = Tween.to(counter, {
            alpha: 0,
            duration: 0.3,
            ease: Easing.EaseInCubic
        })

        counterFadeAnim.play()
    }

    reposition(addListeners: boolean) {
        super.reposition(addListeners)

        const leftPadding = 5

        this.counterContainer.x = leftPadding
        this.counterContainer.y = (this.statusComponent.backgroundSprite.height / 2)
            - (this.counterHeight / 2)
    }
}
