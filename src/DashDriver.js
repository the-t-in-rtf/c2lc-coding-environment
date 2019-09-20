// @flow

const dashServiceUuid = "af237777-879d-6186-1f49-deca0e85d9c1";
const dashCommandCharacteristicUuid = "af230002-879d-6186-1f49-deca0e85d9c1";

// TODO: Communicate connection state
// TODO: Communicate when actions have finished

export default class DashDriver {
    commandCharacteristic: any;

    connect(): void {
        console.log("CONNECTING");
        (navigator: any).bluetooth.requestDevice({
            filters: [{ services: [dashServiceUuid] }]
        }).then((device) => {
            return device.gatt.connect();
        }).then((server) => {
            return server.getPrimaryService(dashServiceUuid);
        }).then((service) => {
            return service.getCharacteristic(dashCommandCharacteristicUuid);
        }).then((characteristic) => {
            this.commandCharacteristic = characteristic;
            console.log("CONNECTED");
        }).catch((error) => {
            console.log("ERROR");
            console.log(error.name);
            console.log(error.message);
        });
    }

    sendCommand(bytes: Array<number>): void {
        this.commandCharacteristic.writeValue(new Uint8Array(bytes));
    }

    forward(): void {
        this.sendCommand([0x23, 0xC8, 0x00, 0x00, 0x03, 0xE8, 0x00, 0x00, 0x80]);
    }

    left(): void {
        this.sendCommand([0x23, 0x00, 0x00, 0x9D, 0x03, 0xE8, 0x00, 0x00, 0x80]);
    }

    right(): void {
        this.sendCommand([0x23, 0x00, 0x00, 0x63, 0x03, 0xE8, 0xC0, 0xC0, 0x80]);
    }
}
