import { gsap, TweenLite, TimelineLite } from 'gsap'
import { v4 as uuidv4 } from 'uuid'
import { Defaults } from '../../utils/Constants'
import { Emitter } from '../../utils/Emitter'

export enum TweenAnimationDirection {
    Normal = 'normal',
    Reverse = 'reverse',
    Alternate = 'alternate'
}

export enum TweenAnimationState {
    Initial = 'initial',
    Playing = 'playing',
    Completed = 'completed',
    Paused = 'paused',
    Interrupted = 'interrupted',
    Error = 'error'
}

export enum TweenAnimationEvent {
    Stopped = 'TweenAnimationstopped'
}

export interface ITweenAnimation {
    state: TweenAnimationState
    duration: number
    currentTime: number
    progressPercent: number
    isPlaying: boolean
    play(): Promise<TweenAnimationState>
    pause(): void
    seek(time: number): void
    restart(): void
}

export interface TweenAnimationOptions {
    name: string 
    targets?: any
    duration?: number
    delay?: number
    loop?: boolean
    ease?: any
    direction?: TweenAnimationDirection
    paused?: boolean
    rotation?: number 
    repeat?: number
    [ key: string ]: any
}

export class TweenAnimation extends Emitter implements TweenAnimation {
    _duration!: number
    name: string 
    state: TweenAnimationState = TweenAnimationState.Initial
    lastCompletionID: string = ''
    animationTween: TweenLite | TimelineLite
    
    complete?: Function 

    constructor(options: TweenAnimationOptions) {
        super()

        this.name = options.name

        this.complete = options.complete

        this.animationTween = this.configure(options)
    }

    configure(options: TweenAnimationOptions): TweenLite | TimelineLite {
        const params = this.generateAnimeParams(options)
        let returnAnimation

        if (params.duration) {
            this.duration = params.duration
        }

        returnAnimation = gsap.to(params.targets!, params)
        
        return returnAnimation
    }

    generateAnimeParams(op: TweenAnimationOptions): TweenAnimationOptions {
        op.duration = op.duration !== undefined ? op.duration : this._duration !== undefined 
            ? this.duration : Defaults.AnimationDuration
        op.autoplay = op.autoplay ? op.autoplay : Defaults.AnimationAutoplay

        const params = {
            name: op.name ?? 'Untitled',
            targets: op.targets ?? undefined,
            alpha: op.alpha ?? 0,
            duration: op.duration / 1000,
            delay: (op.delay ?? Defaults.AnimationDelay) / 1000,
            loop: op.loop ?? Defaults.AnimationLoop,
            repeat: op.loop ? -1 : 0,
            paused: !op.autoplay,
            ease: op.ease ?? Defaults.AnimationEasing,
            direction: op.direction ?? TweenAnimationDirection.Normal,
            rotation: op.rotation ?? 0
        }

        return params
    }

    /**
     * Creates a random ID to identify a completion callback by
     */
    createCompletionID(): string {
        return uuidv4();
    }
    
    play(): Promise<TweenAnimationState> {
        this.state = TweenAnimationState.Playing

        return new Promise(resolve => {
            this.animationTween.eventCallback('onComplete', () => {
                this.state = TweenAnimationState.Completed

                resolve(TweenAnimationState.Completed)
            })

            this.animationTween.play()
        })
    }

    pause() {
        if (this.state === TweenAnimationState.Playing) {
            this.animationTween.pause()
            this.state = TweenAnimationState.Paused
        } else {
            this.state = TweenAnimationState.Error
        }
    }

    seek(time: number) {
        if (time >= this.duration) {
            this.animationTween.seek(time)
            this.pause()
        } else {
            this.animationTween.seek(time)
        }
    }

    restart() {
        this.animationTween.restart()
    }

    get currentTime() {
        return this.animationTween.totalTime()
    }

    get duration() {
        return this._duration
    }

    get isPlaying() {
        return !this.animationTween.paused
    }

    get isPaused() {
        return this.animationTween.paused
    }

    get progressPercent() {
        return this.animationTween.progress()
    }

    set duration(value: number) {
        this._duration = value
        if (this.animationTween !== undefined) {
            this.animationTween.duration(value)
        }
    }
}
