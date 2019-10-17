// @flow

import SpeechRecognitionWrapper from './SpeechRecognitionWrapper';
import SoundexTable from './SoundexTable';

test('Single final word', () => {
    const speechRecognitionInstance = {};
    const soundexTable = new SoundexTable([
        { pattern: /F663/, word: 'forward' }
    ]);
    const handleWord = jest.fn();
    const wrapper = new SpeechRecognitionWrapper(speechRecognitionInstance,
        soundexTable, handleWord);
    wrapper.handleResult({
        resultIndex: 0,
        results: [
            Object.assign(
                [ { transcript: 'forward' } ],
                ({ isFinal: true }: any)
            )
        ]
    });
    expect(handleWord.mock.calls.length).toBe(1);
    expect(handleWord.mock.calls[0][0]).toBe('forward');
});
