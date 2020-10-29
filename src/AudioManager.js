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
                "C1": "C1.wav",
                "C2": "C2.wav",
                "C3": "C3.wav",
                "C4": "C4.wav"
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
        // Modified "Tonnetz" tuning, see https://en.wikipedia.org/wiki/Tonnetz for explanation and diagrams.

        // The centre note (xPos: 0, yPos: 0) is 440hz = A4 = 69.

        // Every "row" is 4 tones from the next but stays within the same octave.
        const xPitchOffset = (5 * characterState.xPos)  % 12;

        // Every "column" is 7 tones from the next.
        const yPitchOffset = (-7 * characterState.yPos);

        const midiNote = 69 + xPitchOffset + yPitchOffset;
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
