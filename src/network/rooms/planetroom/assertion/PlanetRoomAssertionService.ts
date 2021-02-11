import { Flogger } from "../../../../service/Flogger";
import { PlanetRoom } from "../PlanetRoom";

export interface IPlanetRoomAssertionService {
    startLoopingAssertion(): void
    update(): void
}

export class PlanetRoomAssertionService implements IPlanetRoomAssertionService {
    _numberOfTimesAsserted: number = 0
    _currentAssertionFrameInterval: number = 100
    assertionFrameInterval: number = 100

    enableLoopingAssertion: boolean = false
    room: PlanetRoom

    constructor(room: PlanetRoom) {
        this.room = room
    }

    startLoopingAssertion() {
        Flogger.log('PlanetRoomAssertionService', 'startLoopingAssertion', 'already startedLoopAssertion', this.enableLoopingAssertion)

        if (this.enableLoopingAssertion) return

        this.enableLoopingAssertion = true
    }

    stopLoopingAssertion() {
        Flogger.log('PlanetRoomAssertionService', 'startLoopingAssertion', 'startedLoopAssertion', this.enableLoopingAssertion)

        if (!this.enableLoopingAssertion) return

        this.enableLoopingAssertion = false
    }

    update() {
        if (this.enableLoopingAssertion) {
            this._currentAssertionFrameInterval--
    
            if (this._currentAssertionFrameInterval <= 0) {
                this._currentAssertionFrameInterval = this.assertionFrameInterval
    
                this.assertPlanetRoom()
            }
        }
    }

    private assertPlanetRoom() {
        if (this._numberOfTimesAsserted % 5 === 0) {
            Flogger.log('PlanetRoomAssertionService', 'assertPlanetRoom', 'x5', 'numberOfTimesAsserted', this._numberOfTimesAsserted)
        }

        this._numberOfTimesAsserted++
    }
}
