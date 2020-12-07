#!/bin/bash

VOICE=Serena

say -v $VOICE -o Forward1.aiff "forward one square."
say -v $VOICE -o Forward2.aiff "forward two squares."
say -v $VOICE -o Forward3.aiff "forward three squares."

say -v $VOICE -o Left45.aiff "turn left 45 degrees."
say -v $VOICE -o Left90.aiff "turn left 90 degrees."
say -v $VOICE -o Left180.aiff "turn left 180 degrees."

say -v $VOICE -o Right45.aiff "turn right 45 degrees."
say -v $VOICE -o Right90.aiff "turn right 90 degrees."
say -v $VOICE -o Right180.aiff "turn right 180 degrees."


say -v $VOICE -o AddMovement.aiff "Add movement."

# NOTE: The prosody is off for the "Serena" voice unless we add an embedded voice command to create a pause.
say -v $VOICE -o DeleteAll.aiff "Delete [[slnc 1]] all movements"

say -v $VOICE -o DeleteMovement.aiff "Delete movement."

say -v $VOICE -o ReplaceMovement.aiff "Replace movement."

say -v $VOICE -o MoveToPrevious.aiff "Move Right."

# NOTE: The utterance is oddly clipped if we use the "Karen" voice for this specific utterance.
say -v $VOICE -o MoveToNext.aiff "Move Left."

# We convert the raw aiff ourselves because the 'say' command's built in wav output is not usable with a browser.
for i in *.aiff; do sox $i ${i/aiff/wav}; rm $i; done
