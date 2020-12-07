# Generating Announcements

The announcements used in this package are all generated using the TTS engine
built into Mac OS X.  You can use the shell script in this directory to
change the voice or wording and regenerate these files as needed.  In
addition to the TTS support built into the operating system, you will need
to have the `sox` utility available.

Note that in addition to just typing plain text in individual messages, you can
add pronunciation hints and/or phonemes to assist in achieving the desired
output.  Many international voices only partially support these mechanisms.  For
details about the syntax of pronunciation hints and phonemes, see the man page
for the `say` command, or read through Apple's
[Speech Synthesis Programming Guide](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/SpeechSynthesisProgrammingGuide/FineTuning/FineTuning.html#//apple_ref/doc/uid/TP40004365-CH5-SW10)
