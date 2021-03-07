import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { Homeshipical } from '../gamemap/homeship/Homeshipical'
import { GameStateID } from '../manager/GameStateManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { Flogger } from '../service/Flogger'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { WorldSize } from '../utils/Constants'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface ISpaceshipState extends IGameState {

}

export class HomeshipState extends GameState implements ISpaceshipState {
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD
    // player: 

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Homeship
        })

        this.inGameHUD = InGameHUD.getInstance()
        this.ambientLight = new GameplayAmbientLight()
    }

    async initialize() {
        await this.initializeBackground()
        this.camera.viewport.addChild(this.inGameHUD)

        // To get the camera, you need the game stage, pass Game through StateManager
        this.stage.addChild(this.cameraViewport)

        this.gameMapManager.initializeHomeship().then(async () => {
            Flogger.log('GameplayState', 'Homeship initialized')
            const player = this.entityManager.createOfflinePlayer()

            player.light.disableHardLights()

            await this.inGameHUD.initializeHUD()
            
            this.camera.stage.addChildAtLayer(this.ambientLight, CameraLayer.Lighting)
            this.camera.stage.addChildAtLayer(ParticleManager.getInstance().container, CameraLayer.Particle)
            this.camera.stage.addChildAtLayer(ParticleManager.getInstance().overlayContainer, CameraLayer.OverlayParticle)
        })
    }

    update() {
        this.gameMapManager.update()
    }

    demolish() {
        
    }

    initializeBackground() {
        const boundaries = new PIXI.Graphics()
        boundaries.beginFill(0x8F8F8F)
        boundaries.drawRoundedRect(0, 0, WorldSize.width, WorldSize.height, 30)
        this.camera.stage.addChildAtLayer(boundaries, CameraLayer.Background)
    }
}
