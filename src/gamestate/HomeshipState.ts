import { CameraLayer } from '../camera/CameraStage'
import { GameplayAmbientLight } from '../engine/display/lighting/GameplayAmbientLight'
import { Homeshipical } from '../gamemap/homeship/Homeshipical'
import { GameStateID } from '../manager/GameStateManager'
import { ParticleManager } from '../manager/particlemanager/ParticleManager'
import { InGameHUD } from '../ui/ingamehud/InGameHUD'
import { GameState, GameStateOptions, IGameState } from './GameState'

export interface ISpaceshipState extends IGameState {

}

export class HomeshipState extends GameState implements ISpaceshipState {
    ambientLight: GameplayAmbientLight
    inGameHUD: InGameHUD

    constructor(options: GameStateOptions) {
        super({
            game: options.game,
            id: GameStateID.Homeship
        })

        this.inGameHUD = InGameHUD.getInstance()
        this.ambientLight = new GameplayAmbientLight()
    }

    async initialize() {
        this.camera.viewport.addChild(this.inGameHUD)

        await this.inGameHUD.initializeHUD()

        // To get the camera, you need the game stage, pass Game through StateManager
        this.stage.addChild(this.cameraViewport)

        this.gameMapManager.initializeHomeship().then(() => {
            
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
}
