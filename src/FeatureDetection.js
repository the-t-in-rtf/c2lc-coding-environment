// @flow

function bluetoothApiIsAvailable(): boolean {
    return !!((navigator: any).bluetooth);
}

function speechRecognitionApiIsAvailable(): boolean {
    return !!((window: any).webkitSpeechRecognition);
}

export { bluetoothApiIsAvailable, speechRecognitionApiIsAvailable };
