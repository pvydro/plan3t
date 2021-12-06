import { Tween } from '../../engine/display/tween/Tween'
import { Camera } from '../Camera'
import { Easing } from '../../engine/display/tween/TweenEasing'

export interface ICameraZoomPlugin {
    setZoom(value: number): void
    revertZoom(): void
}

export class CameraZoomPlugin implements ICameraZoomPlugin {
    camera: Camera
    currentZoomAnimation: TweenLite

    constructor(camera: Camera) {
        this.camera = camera
    }

    setZoom(value: number) {
        this.easeTo(value)
    }

    revertZoom() {
        this.easeTo(this.camera.baseZoom)
    }

    private easeTo(value: number, duration?: number) {
        const baseZoom = (value === this.camera.baseZoom ? this.camera.zoom : this.camera.baseZoom)
        let interpolation = { zoom: baseZoom }

        this.interruptAnimation()
        
        this.currentZoomAnimation = Tween.to(interpolation, {
            zoom: value,
            duration: duration ?? 1,
            easing: Easing.EaseOutCirc,
            onUpdate: () => {
                this.camera.setZoom(interpolation.zoom)
            }
        })

        this.currentZoomAnimation.play()
    }
    
    private interruptAnimation() {
        if (this.currentZoomAnimation) {
            this.currentZoomAnimation.pause()
            this.currentZoomAnimation.kill()
            this.currentZoomAnimation = undefined
        }
    }
}
