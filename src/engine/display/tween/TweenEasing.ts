import { gsap, Sine, Bounce, Cubic, Expo, Circ, Quad, Quart, Quint, Elastic, Power0, Power2, Power4 } from 'gsap'
import { RoughEase } from 'gsap/EasePack'

gsap.registerPlugin(RoughEase)

export const Easing = {
    Linear: Power0.easeNone,
    EaseInQuad: Quad.easeIn,
    EaseInCubic: Cubic.easeIn,
    EaseInQuart: Quart.easeIn,
    EaseInQuint: Quint.easeIn,
    EaseInSine: Sine.easeIn,
    EaseInExpo: Expo.easeIn,
    EaseInCirc: Circ.easeIn,
    EaseInElastic: Elastic.easeIn,
    EaseInBounce: Bounce.easeOut,
    EaseOutQuad: Quad.easeOut,
    EaseOutCubic: Cubic.easeOut,
    EaseOutQuart: Quart.easeOut,
    EaseOutQuint: Quint.easeOut,
    EaseOutSine: Sine.easeOut,
    EaseOutExpo: Expo.easeOut,
    EaseOutCirc: Circ.easeOut,
    EaseOutElastic: Elastic.easeOut,
    EaseOutBounce: Bounce.easeOut,
    EaseInOutQuad: Quad.easeInOut,
    EaseInOutCubic: Cubic.easeInOut,
    EaseInOutQuart: Quart.easeInOut,
    EaseInOutSine: Sine.easeInOut,
    EaseInOutExpo: Expo.easeInOut,
    EaseInOutCirc: Circ.easeInOut,
    EaseInOutElastic: Elastic.easeInOut,
    EaseInOutBounce: Bounce.easeInOut,
    Power4EaseOut: Power4.easeOut,
    RoughEase: {
        ThreeCubicOut: RoughEase.ease.config({
            template: Power2.easeOut,
            strength: 0.5,
            points: 8,
            taper: 'none',
            randomize: false,
            clamp: true
        }),
        Five: RoughEase.ease.config({
            template: Power0.easeOut,
            strength: 0.2, points: 5,
            taper: 'none', clamp: false
        })
    }
}
