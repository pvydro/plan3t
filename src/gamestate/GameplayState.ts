import { Room } from 'colyseus.js'
import { Camera } from '../camera/Camera'
import { CameraLayer } from '../camera/CameraStage'
import { Viewport } from '../camera/Viewport'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { IClientManager } from '../manager/ClientManager'
import { GameMapManager, IGameMapManager } from '../manager/GameMapManager'
import { GameStateID } from '../manager/GameStateManager'
import { GravityManager, IGravityManager } from '../manager/GravityManager'
import { ParticleManager } from '../manager/ParticleManager'
import { IRoomManager, RoomManager } from '../manager/roommanager/RoomManager'
import { PassiveHornet } from '../passivecreature/passivehornet/PassiveHornet'
import { Flogger } from '../service/Flogger'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { ShowCameraProjectionDebug, WorldSize } from '../utils/Constants'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface IGameplayState extends IGameState {
    cameraViewport: Viewport
}

export class GameplayState extends GameState implements IGameplayState {
    roomManager: IRoomManager
    clientManager: IClientManager
    gameMapManager: IGameMapManager
    gravityManager: IGravityManager
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD

    hornet: PassiveHornet

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Gameplay
        })

        this.clientManager = this.game.clientManager
        this.gravityManager = GravityManager.getInstance()
        this.gameMapManager = new GameMapManager({
            clientManager: this.clientManager
        })
        this.roomManager = RoomManager.getInstance({
            clientManager: this.clientManager,
            gameMapManager: this.gameMapManager
        })

        this.ambientLight = new GameplayAmbientLight()
        this.inGameHUD = InGameHUD.getInstance()

        this.hornet = new PassiveHornet()

        this.cameraStage.addChildAtLayer(this.hornet, CameraLayer.Players)
    }
    
    async initialize() {

        // TODO - Attempt roomManager.initialize, then pull map from roommanager
        // If map doesn't exist, create new map on client and send to server
        // If failed to initialize room, create random map

        await this.initializeBackground()
        this.camera.viewport.addChild(this.inGameHUD)

        this.roomManager.initializeRoom().then(async (room: Room) => {
            Flogger.log('GameplayState', 'Room initialized')

            console.log(room.state.planetHasBeenSet)

            await this.inGameHUD.initializeHUD()
    
            // To get the camera, you need the game stage, pass Game through StateManager
            this.stage.addChild(this.cameraViewport)
    
            this.camera.stage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
            this.camera.stage.addChildAtLayer(ParticleManager.getInstance().container, CameraLayer.Particle)
            this.camera.stage.addChildAtLayer(ParticleManager.getInstance().overlayContainer, CameraLayer.OverlayParticle)


            // const data = this.gameMapManager.gameMap.currentSpherical.data
            // const dataPoints = []

            // Construct message-able point array
            // data.points.forEach((point: ISphericalPoint) => {
            //     dataPoints.push({
            //         x: point.x, y: point.y,
            //         tileValue: {
            //             r: point.tileValue.r,
            //             g: point.tileValue.g,
            //             b: point.tileValue.b,
            //             a: point.tileValue.a
            //         },
            //         tileSolidity: point.tileSolidity
            //     })
            // })

            // this.roomManager.currentRoom.send('newPlanet', {
            //     biome: data.biome,
            //     points: dataPoints,
            //     dimension: {
            //         width: data.dimension.width,
            //         height: data.dimension.height,
            //     }
            // })
        })
    }

    update() {
        this.gameMapManager.update()
        this.ambientLight.update()
        this.inGameHUD.update()
        this.hornet.update()
    }

    demolish() {

    }

    initializeBackground() {
        const boundaries = new PIXI.Graphics()
        boundaries.beginFill(0x000000)
        boundaries.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        this.camera.stage.addChildAtLayer(boundaries, CameraLayer.Background)
    }

    get camera() {
        return this.game.camera
    }

    get cameraStage() {
        return this.camera.stage
    }

    get cameraViewport() {
        return this.game.cameraViewport
    }

    get stage() {
        return this.game.stage
    }

    get entityManager() {
        return this.clientManager.entityManager
    }
}
