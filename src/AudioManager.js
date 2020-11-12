// @flow

import { Midi, Panner, Player, Sampler, start as ToneStart} from 'tone';
import CharacterState from './CharacterState';
import type {AnnouncedSoundName} from './types';

type AnnouncementLookupTable = {
    forward1: Player,
    forward2: Player,
    forward3: Player,
    left45: Player,
    left90: Player,
    left180: Player,
    right45: Player,
    right90: Player,
    right180: Player,
    add: Player,
    deleteAll: Player,
    delete: Player,
    moveToPrevious: Player,
    moveToNext: Player,
    replace: Player
}

const AnnouncementDefs = new Map<string, string>([
    ['forward1', '/audio/Move.wav'],
    ['forward2', '/audio/Move.wav'],
    ['forward3', '/audio/Move.wav'],
    ['left45', '/audio/TurnLeft.wav'],
    ['left90', '/audio/TurnLeft.wav'],
    ['left180', '/audio/TurnLeft.wav'],
    ['right45', '/audio/TurnRight.wav'],
    ['right90', '/audio/TurnRight.wav'],
    ['right180', '/audio/TurnRight.wav'],
    ['add', './audio/AddMovement.wav'],
    ['deleteAll', '/audio/DeleteAll.wav'],
    ['delete', '/audio/DeleteMovement.wav'],
    ['moveToPrevious', '/audio/MoveToLeft.wav'],
    ['moveToNext', '/audio/MoveToRight.wav'],
    ['replace', '/audio/ReplaceMovement.wav']
]);

const SamplerDefs = {
    // The percussion instruments we use actually don't vary their pitch, so we use the same sample at different
    // pitches so that we can scale relative to the octave without ending up with wildy different tempos.
    left45: {
        urls: {
            "C0": "C6.wav",
            "C1": "C6.wav",
            "C2": "C6.wav",
            "C3": "C6.wav",
            "C4": "C6.wav",
            "C5": "C6.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/left/45/"
    },
    left90: {
        urls: {
            "C0": "C6.wav",
            "C1": "C6.wav",
            "C2": "C6.wav",
            "C3": "C6.wav",
            "C4": "C6.wav",
            "C5": "C6.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/left/90/"
    },
    left180: {
        urls: {
            "C0": "C6.wav",
            "C1": "C6.wav",
            "C2": "C6.wav",
            "C3": "C6.wav",
            "C4": "C6.wav",
            "C5": "C6.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/left/180/"
    },
    right45: {
        urls: {
            "C0": "C6.wav",
            "C1": "C6.wav",
            "C2": "C6.wav",
            "C3": "C6.wav",
            "C4": "C6.wav",
            "C5": "C6.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/right/45/"
    },
    right90: {
        urls: {
            "C0": "C6.wav",
            "C1": "C6.wav",
            "C2": "C6.wav",
            "C3": "C6.wav",
            "C4": "C6.wav",
            "C5": "C6.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/right/90/"
    },
    right180: {
        urls: {
            "C0": "C6.wav",
            "C1": "C6.wav",
            "C2": "C6.wav",
            "C3": "C6.wav",
            "C4": "C6.wav",
            "C5": "C6.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/right/180/"
    },
    forward1: {
        urls: {
            "C0": "C0.wav",
            "C1": "C1.wav",
            "C2": "C2.wav",
            "C3": "C3.wav",
            "C4": "C4.wav",
            "C5": "C5.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/forward/1/"
    },
    forward2: {
        urls: {
            "C0": "C0.wav",
            "C1": "C1.wav",
            "C2": "C2.wav",
            "C3": "C3.wav",
            "C4": "C4.wav",
            "C5": "C5.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/forward/2/"
    },
    forward3: {
        urls: {
            "C0": "C0.wav",
            "C1": "C1.wav",
            "C2": "C2.wav",
            "C3": "C3.wav",
            "C4": "C4.wav",
            "C5": "C5.wav",
            "C6": "C6.wav"
        },
        baseUrl: "/audio/forward/3/"
    }
}

function octaveModulo (rawPitch: number) : number {
    const adjustedPitch = rawPitch % 12;
    return adjustedPitch < 0 ? adjustedPitch + 12 : adjustedPitch;
}

// Modified "Tonnetz" tuning, see https://en.wikipedia.org/wiki/Tonnetz for explanation and diagrams.
export function getNoteForState (characterState: CharacterState) : string {
    // The centre note (xPos: 0, yPos: 0) is 440hz = A4 = 69.

    // Every "column" is 7 tones from the next but stays within the same octave.  This results in a pattern that
    // cycles through the full octave range every 12 squares.
    const xPitchOffset = octaveModulo(7 * characterState.xPos);


    // Every "row" is 4 tones from the next but stays within the same octave.  This results in a pattern of three
    // notes that repeats every three rows.
    const yPitchOffset = octaveModulo(4 * characterState.yPos);

    const combinedPitchOffset = octaveModulo(xPitchOffset + yPitchOffset);

    // To vary the range of notes without going too high or low, we use the repeating nature of the "row" pattern
    // to divide the tuning into "octave bands" every three rows.  The middle band (yPos of -1, 0, or 1) is octave 3.
    // The "band" above centre (yPos of 2, 3, or 4) is octave 4.  Anything higher is octave 5. The "band" below
    // centre (yPos of -2, -3, or -4) is octave 2.  Anything lower is octave 1.
    const octaveOffset = (Math.round(characterState.yPos / 3));
    const boundedOctaveOffset = Math.max(Math.min(3, octaveOffset), -3);
    const octave = 4 - boundedOctaveOffset;

    // const midiNote = (12 * octave);
    const midiNote = combinedPitchOffset + (12 * octave);
    const noteName: string = Midi(midiNote).toNote();

    return noteName;
}

export default class AudioManager {
    audioEnabled: boolean;
    announcementLookUpTable: AnnouncementLookupTable;
    samplers: {
        forward1: Sampler,
        forward2: Sampler,
        forward3: Sampler,
        left45: Sampler,
        left90: Sampler,
        left180: Sampler,
        right45: Sampler,
        right90: Sampler,
        right180: Sampler
    };
    panner: Panner;
    toneStartHasBeenCalled: boolean;

    startPromise: Promise<void>;
    startResolve: function;
    startReject: function;

    toneStartPromise: Promise<void>;
    toneStartResolve: function;
    toneStartReject: function;

    constructor(audioEnabled: boolean) {
        this.audioEnabled = audioEnabled;

        // Flag our audio as not having been started.
        this.toneStartHasBeenCalled = false;

        this.startPromise = new Promise((resolve, reject) => {
            this.startResolve = resolve;
            this.startReject = reject;
        });

        this.createSoundInfrastructure();
    }

    createSoundInfrastructure = () => {
        try {
            this.buildAnnouncementLookUpTable();

            this.panner = new Panner();
            this.panner.toDestination();

            this.samplers = {};

            Object.keys(SamplerDefs).forEach((samplerKey) => {
                const samplerDef = SamplerDefs[samplerKey];
                const sampler = new Sampler(samplerDef);
                sampler.connect(this.panner);
                this.samplers[samplerKey] = sampler;
            });

            this.startResolve();
        }
        catch (error) {
            this.startReject(error);
        }
    }

    buildAnnouncementLookUpTable() {
        this.announcementLookUpTable = {};
        AnnouncementDefs.forEach((value, key) => {
            const player = new Player(value);
            player.toDestination();
            this.announcementLookUpTable[key] = player;
        });
    }

    playAnnouncement(soundName: AnnouncedSoundName) {
        if (this.audioEnabled) {
            this.startPromise.then(() => {
                debugger;
                const player = this.announcementLookUpTable[soundName];
                if (player.loaded) {
                    player.start();
                }
            });
        }
    }

    // TODO: Add a better type for pitch.
    playPitchedSample(sampler: Sampler, pitch: string, releaseTime: number) {
        if (this.audioEnabled) {
            // We can only play the sound if it's already loaded.
            if (sampler.loaded) {
                sampler.triggerAttackRelease([pitch], releaseTime);
            }
        }
    }

    playSoundForCharacterState(samplerKey: string, releaseTimeInMs: number, characterState: CharacterState) {
        if (this.audioEnabled) {
            this.startPromise.then(() => {
                const releaseTime = releaseTimeInMs / 1000;
                const noteName = getNoteForState(characterState);

                const sampler: Sampler = this.samplers[samplerKey];

                this.playPitchedSample(sampler, noteName, releaseTime);

                // Pan left/right to suggest the relative horizontal position.
                // As we use a single Sampler grade, our best option for panning is
                // to pan all sounds.  We can discuss adjusting this once we have
                // multiple sound-producing elements in the environment.
                const panningLevel = Math.min(1, Math.max(-1, (0.1 * characterState.xPos)));

                // TODO: Consider making the timing configurable or tying it to the movement timing.
                this.panner.pan.rampTo(panningLevel, 0.5)
            });
        }
    }

    setAudioEnabled(value: boolean) {
        this.audioEnabled = value;
    }

    startTone = () => {
        // Ensure that sound support is started on any user action.
        if (!this.toneStartHasBeenCalled) {
            ToneStart().then(this.startResolve, this.startReject);
            this.toneStartHasBeenCalled = true;
        }
    }
};
