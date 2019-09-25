// @flow

function bluetoothApiIsAvailable(): boolean {
    return !!((navigator: any).bluetooth);
}

export { bluetoothApiIsAvailable };
