import { Room } from 'colyseus.js'
import { CameraLayer } from '../camera/CameraStage'
import { Viewport } from '../camera/Viewport'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { GameStateID } from '../manager/GameStateManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { PassiveHornet } from '../creature/passivehornet/PassiveHornet'
import { Flogger } from '../service/Flogger'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { WorldSize } from '../utils/Constants'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface IGameplayState extends IGameState {
    cameraViewport: Viewport
}

export class GameplayState extends GameState implements IGameplayState {
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD
    hornet: PassiveHornet

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Gameplay
        })

        this.ambientLight = new GameplayAmbientLight()
        this.hornet = new PassiveHornet()
        this.inGameHUD = InGameHUD.getInstance()

        this.cameraStage.addChildAtLayer(this.hornet, CameraLayer.GameMapOverlay)
    }
    
    async initialize() {
        await this.initializeBackground()
        this.camera.viewport.addChild(this.inGameHUD)

        // this.roomManager.initializeRoom().then(async (room: Room) => {
        //     Flogger.log('GameplayState', 'Room initialized')

        //     await this.inGameHUD.initializeHUD()
    
        //     this.camera.stage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
        //     this.camera.stage.addChildAtLayer(ParticleManager.getInstance().container, CameraLayer.Particle)
        //     this.camera.stage.addChildAtLayer(ParticleManager.getInstance().overlayContainer, CameraLayer.OverlayParticle)
        // })
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
}
