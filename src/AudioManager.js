// @flow

import { Midi, Panner, Player, Sampler } from 'tone';
import CharacterState from './CharacterState';
import type {AnnouncedSoundName} from './types';

type AnnouncementLookupTable = {
    forward: Player,
    left: Player,
    right: Player,
    add: Player,
    deleteAll: Player,
    delete: Player,
    moveToPrevious: Player,
    moveToNext: Player,
    replace: Player
}

const AnnouncementDefs = new Map<string, string>([
    ['forward', '/audio/Move.wav'],
    ['left', '/audio/TurnLeft.wav'],
    ['right', '/audio/TurnRight.wav'],
    ['add', './audio/AddMovement.wav'],
    ['deleteAll', '/audio/DeleteAll.wav'],
    ['delete', '/audio/DeleteMovement.wav'],
    ['moveToPrevious', '/audio/MoveToLeft.wav'],
    ['moveToNext', '/audio/MoveToRight.wav'],
    ['replace', '/audio/ReplaceMovement.wav']
]);

export default class AudioManager {
    audioEnabled: boolean;
    announcementLookUpTable: AnnouncementLookupTable;
    panner: Panner;
    sampler: Sampler;

    constructor(audioEnabled: boolean) {
        this.audioEnabled = audioEnabled;

        this.buildAnnouncementLookUpTable();

        this.sampler = new Sampler({
            urls: {
                "C0": "C0.wav",
                "C1": "C1.wav",
                "C2": "C2.wav",
                "C3": "C3.wav",
                "C4": "C4.wav",
                "C5": "C5.wav",
                "C6": "C6.wav"
            },
            // TODO: Make this configurable
            baseUrl: "/audio/long-bell/"
        });

        this.panner = new Panner();
        this.panner.toDestination();

        this.sampler.connect(this.panner);
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
            const player = this.announcementLookUpTable[soundName];
            player.start();
        }
    }

    // TODO: Add a better type for pitch.
    playPitchedSample(pitch: string) {
        // TODO: Make the release configurable
        this.sampler.triggerAttackRelease([pitch], 5);
    }

    playSoundForCharacterState(characterState: CharacterState) {
        // TODO: Extract position -> pitch algo and generate a diagram of the tuning.
        // Modified "Tonnetz" tuning, see https://en.wikipedia.org/wiki/Tonnetz for explanation and diagrams.

        // The centre note (xPos: 0, yPos: 0) is 440hz = A4 = 69.

        // Every "column" is 7 tones from the next but stays within the same octave.  This results in a pattern that
        // cycles through the full octave range every 12 squares.
        const xPitchOffset = (7 * characterState.xPos) % 12;


        // Every "row" is 4 tones from the next but stays within the same octave.  This results in a pattern of three
        // notes that repeats every three rows.
        const yPitchOffset = (4 * characterState.yPos) % 12;

        // To vary the range of notes without going too high or low, we use the repeating nature of the "row" pattern
        // to divide the tuning into "octave bands" every three rows.  The middle band (yPos of -1, 0, or 1) is octave 3.
        // The "band" above centre (yPos of 2, 3, or 4) is octave 4.  Anything higher is octave 5. The "band" below
        // centre (yPos of -2, -3, or -4) is octave 2.  Anything lower is octave 1.
        const boundedYpos = characterState.yPos > 0 ? Math.max(5, characterState.yPos) : Math.max(-9, characterState.yPos);
        const octaveOffset = (Math.ceil((boundedYpos + 2) / 3)) * -1;
        const octave = 5 + octaveOffset;

        const midiNote = xPitchOffset + yPitchOffset + (12 * octave);
        const noteName: string = Midi(midiNote).toNote();

        this.playPitchedSample(noteName);

        // Pan left/right to suggest the relative horizontal position.
        // As we use a single Sampler grade, our best option for panning is
        // to pan all sounds.  We can discuss adjusting this once we have
        // multiple sound-producing elements in the environment.
        const panningLevel = (0.1 * characterState.xPos);

        // TODO: Consider making the timing configurable or tying it to the movement timing.
        this.panner.pan.rampTo(panningLevel, 0.5)
    }

    setAudioEnabled(value: boolean) {
        this.audioEnabled = value;
    }
};
