declare module "tone" {
    // TODO: There are two things called "Frequency" in Tone.js
    //       https://tonejs.github.io/docs/14.7.58/type/Frequency
    //       https://tonejs.github.io/docs/14.7.58/fn/Frequency
    //       This "Frequency" is the type one, maybe call it FrequencyType?
    declare type Frequency = string;
    // https://tonejs.github.io/docs/14.7.58/type/Note
    declare type Note = string;
    // https://tonejs.github.io/docs/14.7.58/type/Seconds
    declare type Seconds = number;
    // https://tonejs.github.io/docs/14.7.58/type/Time
    declare type Time = Seconds;
    // https://tonejs.github.io/docs/14.7.58/type/TimeValue
    declare type TimeValue = Time;

    // https://tonejs.github.io/docs/14.7.58/Param
    declare interface Param {
        rampTo(value: any, rampTime: Time): void
    }

    // https://tonejs.github.io/docs/14.7.58/MidiClass
    declare class MidiClass {
        toNote(): Note
    }

    // https://tonejs.github.io/docs/14.7.58/fn/Midi
    declare export function Midi(value: TimeValue): MidiClass;

    // https://tonejs.github.io/docs/14.7.58/Panner
    declare export class Panner {
        pan: Param,
        toDestination(): void
    }

    // https://tonejs.github.io/docs/14.7.58/Player
    declare export class Player {
        constructor(url: string): Player,
        toDestination(): void,
        start(): void
    }

    // https://tonejs.github.io/docs/14.7.58/interface/SamplerOptions
    declare type SamplerOptions = {
        baseUrl: string,
        urls: SamplesMap
    }

    declare type SamplesMap = {
        [note: string]: string;
    }

    // https://tonejs.github.io/docs/14.7.58/Sampler
    declare export class Sampler {
        constructor(samples: SamplerOptions): Sampler,
        connect(Panner): void,
        triggerAttackRelease(notes: Array<Frequency>, duration: Time): void
    }
}
