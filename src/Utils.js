// @flow

let idCounter: number = 0;

function generateId(prefix: string): string {
    const id = `${prefix}-${idCounter}`;
    idCounter += 1;
    return id;
}

function makeDelayedPromise(timeMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
}

export { generateId, makeDelayedPromise };
