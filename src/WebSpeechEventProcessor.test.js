// @flow

import WebSpeechEventProcessor from './WebSpeechEventProcessor';
import SoundexTable from './SoundexTable';

const soundexTable = new SoundexTable([
    { pattern: /F663/, word: 'forward' }, // FRRD
    { pattern: /L130/, word: 'left'    }, // LFT
    { pattern: /R230/, word: 'right'   }  // RGT
]);

test('A result with no alternatives', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);
    const words = processor.processEvent({
        resultIndex: 0,
        results: [
            Object.assign(
                [], // No alternatives
                ({ isFinal: true }: any)
            )
        ]
    });
    expect(words.length).toBe(0);
});

test('Single final word', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);
    const words = processor.processEvent({
        resultIndex: 0,
        results: [
            Object.assign(
                [ { transcript: 'frard' } ],
                ({ isFinal: true }: any)
            )
        ]
    });
    expect(words.length).toBe(1);
    expect(words[0]).toBe('forward');
});

test('Two final words', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);
    const words = processor.processEvent({
        resultIndex: 0,
        results: [
            Object.assign(
                [ { transcript: 'frard lft' } ],
                ({ isFinal: true }: any)
            )
        ]
    });
    expect(words.length).toBe(2);
    expect(words[0]).toBe('forward');
    expect(words[1]).toBe('left');
});

test('Multiple events', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);

    // First event: first, non-final word
    const words1 = processor.processEvent({
        resultIndex: 0,
        results: [
            Object.assign(
                [ { transcript: 'frard' } ],
                ({ isFinal: false }: any)
            )
        ]
    });
    expect(words1.length).toBe(1);
    expect(words1[0]).toBe('forward');

    // Second event: finalize our first word
    // We expect no processed word here, as we have already seen the word
    const words2 = processor.processEvent({
        resultIndex: 0,
        results: [
            Object.assign(
                // The word has changed in its finalization, but we still
                // ignore it as we returned it last time in its interim form
                [ { transcript: 'lft' } ],
                ({ isFinal: true }: any)
            )
        ]
    });
    expect(words2.length).toBe(0);

    // Third event: add a second word
    const words3 = processor.processEvent({
        resultIndex: 1,
        results: [
            Object.assign(
                [ { transcript: 'lft' } ],
                ({ isFinal: true }: any)
            ),
            Object.assign(
                [ { transcript: 'rgt' } ],
                ({ isFinal: false }: any)
            )
        ]
    });
    expect(words3.length).toBe(1);
    expect(words3[0]).toBe('right');

    // Fourth event: finalize the second word
    const words4 = processor.processEvent({
        resultIndex: 0,
        results: [
            Object.assign(
                // The word has changed in its finalization, but we still
                // ignore it as we returned it last time in its interim form
                [ { transcript: 'lft' } ],
                ({ isFinal: true }: any)
            )
        ]
    });
    expect(words4.length).toBe(0);

    // Fifth event: now a third word, finalized, without interim
    const words5 = processor.processEvent({
        resultIndex: 0,
        results: [
            Object.assign(
                [ { transcript: 'frard' } ],
                ({ isFinal: true }: any)
            )
        ]
    });
    expect(words5.length).toBe(1);
    expect(words5[0]).toBe('forward');
});
