// import { IUpdatable } from '../../../interface/IUpdatable'
// import { Player } from '../Player'
// import { PlanetRoom } from './PlanetRoom'

// export interface IPlanetRoomPlayerController extends IUpdatable {
//     updatePlayer(player: Player)
// }

// export class PlanetRoomPlayerController implements IPlanetRoomPlayerController {
//     room: PlanetRoom

//     constructor(room: PlanetRoom) {
//         this.room = room
//     }

//     update() {

//         // this.players.forEach((player: Player, sessionId: string) => {
//         //     // if (player.hasSpawned) {
//         //         player.yVel += ((player.weight / 3) * 1) * delta
//         //         player.x += (player.xVel * delta)
//         //         player.y += (player.yVel * delta)
//         //     // }
//         // })
//     }

//     updatePlayer(player: Player) {
//         const delta = 1//PlanetRoom.Delta
        
//         if (player.hasSpawned) {
//             player.yVel += ((player.weight / 3) * 1) * delta
//             player.x += (player.xVel * delta)
//             player.y += (player.yVel * delta)
//         }

//     }

//     get state() {
//         return this.room.state
//     }

//     get players() {
//         return this.state.players
//     }
// }
