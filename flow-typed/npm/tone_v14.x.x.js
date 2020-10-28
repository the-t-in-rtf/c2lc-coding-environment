declare module "tone" {
    declare type Frequency = {
        toNote: (string:string) => string
    }

    declare type Signal = {
        value: number,
        rampTo: (number: number) => any
    }

    // https://tonejs.github.io/docs/14.7.58/ToneAudioNode
    declare interface ToneAudioNode {
        connect(node: ToneAudioNode): undefined,
        toDestination (): undefined
    }

    declare function Midi (number: number): typeof Frequency

    // https://tonejs.github.io/docs/14.7.58/Panner
    declare type PannerProps = number | {
        channelCount: number,
        context?: any,
        pan?: number
    }

    declare class Panner implements ToneAudioNode {
        constructor (props?: PannerProps): typeof Panner,
        connect(node: ToneAudioNode): typeof Panner,
        pan: Signal,
        toDestination (): typeof Panner
    }

    declare class Player extends ToneAudioNode {
        constructor (url: string): typeof Player,
        connect(node: ToneAudioNode): typeof Player,
        toDestination (): typeof Player,
        start (offset: number): typeof Player
    }

    // https://tonejs.github.io/docs/14.7.58/Sampler
    declare type SamplerProps = {
        urls: {},
        baseUrl: string
    }

    declare class Sampler {
        constructor (props: SamplerProps): typeof Sampler,
        connect(node: ToneAudioNode): undefined,
        toDestination (): undefined,
        triggerAttackRelease ( notes: string | Array<string>, duration?: number) : typeof Sampler
    }

    declare var exports: {
        Midi: Midi,
        Panner: typeof Panner,
        Player: typeof Player,
        Sampler: typeof Sampler
    }
}