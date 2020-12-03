// @flow

import { Midi, Player, Sampler } from 'tone';
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

/*

    "Guitar" tuning, where row 0 is between the 2nd (A2) and 3rd string, and column -8 is the open string.

        -8  -7  -6  -5  -4  -3  -2  -1   0  +1  +2  +3  +4  +5  +6  +7  +8
       -----------------------------------------------------------------------
    +5 E4  F4  F#4 G4  G#4 A4  A#4 B4   C5 C#5 D5  D#5 E5  F5  F#5 G5  G#5
    +4 -----------------------------------------------------------------------
    +3 B3  C4  C#4 D4  D#4 E4  F4  F#4  G4 G#4 A4  A#4 B4  C5  C#5 D5  D#5
    +2 -----------------------------------------------------------------------
    +1 G3  G#3 A3  A#3 B3  C4  C#4 D4  D#4 E4  F4  F#4 G4  G#4 A4  A#4 B4
     0 -----------------------------------------------------------------------
    -1 D3  D#3 E3  F3  F#3 G3  G#3 A3  A#3 B3  C4  C#4 D4  D#4 E4  F4  F#4
    -2 -----------------------------------------------------------------------
    -3 A2  A#2  B2  C3 C#3 D3  D#3 E3  F3  F#3 G3  G#3 A3  A#3 B3  C4  C#4
    -4 -----------------------------------------------------------------------
    -5 E2  F2  F#2 G2  G#2 A2  A#2  B2  C3 C#3 D3  D#3 E3  F3  F#3 G3  G#3

    Converted to MIDI notes, that would be:

        -8 -7 -6 -5 -4 -3 -2 -1 00 +1 +2 +3 +4 +5 +6 +7 +8
       ----------------------------------------------------
    +5  64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
    +4 ----------------------------------------------------
    +3  59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75
    +2 ----------------------------------------------------
    +1  55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71
    00 ----------------------------------------------------
    -1  50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66
    -2 ----------------------------------------------------
    -3  45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61
    -4 ----------------------------------------------------
    -5  40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56

*/
export function getNoteForState (characterState: CharacterState) : string | false {
    const openNoteByStringNumber = [40, 45, 50, 55, 59, 64];
    if (characterState.yPos %2) {
        const stringNumber = Math.min(5, Math.max(0, (characterState.yPos + 5) / 2));
        const midiNote = openNoteByStringNumber[stringNumber] + (characterState.xPos + 8);
        const noteName: string = Midi(midiNote).toNote();
        return noteName;
    }

    return false;
}

export default class AudioManager {
    audioEnabled: boolean;
    announcementLookUpTable: AnnouncementLookupTable;
    samplers: {
        movement: Sampler
    };

    constructor(audioEnabled: boolean) {
        this.audioEnabled = audioEnabled;

        this.buildAnnouncementLookUpTable();

        this.samplers = {};


        this.samplers.movement = new Sampler({
            urls: {
                "A1": "A1.wav",
                "A2": "A2.wav",
                "A3": "A3.wav",
                "A4": "A4.wav",
                "A5": "A5.wav"
            },
            baseUrl: "/audio/guitar/"
        });

        this.samplers.movement.toDestination();
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
            if (player.loaded) {
                player.start();
            }
        }
    }

    // TODO: Add a better type for pitch.
    // TODO: Make this private, as it doesn't respect the audioEnabled setting.
    playPitchedSample(sampler: Sampler, pitch: string, releaseTime: number) {
        // We can only play the sound if it's already loaded.
        if (sampler.loaded) {
            sampler.triggerAttackRelease([pitch], releaseTime);
        }
    }

    playSoundForCharacterState(samplerKey: string, releaseTimeInMs: number, characterState: CharacterState) {
        if (this.audioEnabled) {
            const releaseTime = releaseTimeInMs / 1000;
            const noteName = getNoteForState(characterState);

            if (noteName) {
                const sampler: Sampler = this.samplers[samplerKey];
                if (sampler) {
                    this.playPitchedSample(sampler, noteName, releaseTime);
                }
            }
        }
    }

    setAudioEnabled(value: boolean) {
        this.audioEnabled = value;
    }
};
