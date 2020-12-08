#!/bin/bash
#
# Generated using mimic:
#
# https://mycroft-ai.gitbook.io/docs/mycroft-technologies/mimic-overview#notes-on-mimic-voices
#
VOICE=slt

mimic -voice $VOICE -t "forward one square." -o Forward1.wav
mimic -voice $VOICE -o Forward2.wav -t "forward two squares."
mimic -voice $VOICE -o Forward3.wav -t "forward three squares."

mimic -voice $VOICE -o Left45.wav -t "turn left 45 degrees."
mimic -voice $VOICE -o Left90.wav -t "turn left 90 degrees."
mimic -voice $VOICE -o Left180.wav -t "turn left 180 degrees."

mimic -voice $VOICE -o Right45.wav -t "turn right 45 degrees."
mimic -voice $VOICE -o Right90.wav -t "turn right 90 degrees."
mimic -voice $VOICE -o Right180.wav -t "turn right 180 degrees."


mimic -voice $VOICE -o AddMovement.wav -t "Add movement."

mimic -voice $VOICE -o DeleteAll.wav -t "Delete all movements"

mimic -voice $VOICE -o DeleteMovement.wav -t "Delete movement."

mimic -voice $VOICE -o ReplaceMovement.wav -t "Replace movement."

mimic -voice $VOICE -o MoveToPrevious.wav -t "Move to left."

mimic -voice $VOICE -o MoveToNext.wav -t "Move to right."

