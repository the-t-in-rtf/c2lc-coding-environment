// @flow

let idCounter: number = 0;

/* istanbul ignore next */
function generateId(prefix: string): string {
    const id = `${prefix}-${idCounter}`;
    idCounter += 1;
    return id;
}

/* istanbul ignore next */
function makeDelayedPromise(timeMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
}

function generateEncodedProgramURL(versionString: string, themeString: string, programString: string, characterStateString: string): string {
    return `?v=${encodeURIComponent(versionString)}&t=${themeString}&p=${encodeURIComponent(programString)}&c=${encodeURIComponent(characterStateString)}`;
}

export { generateId, makeDelayedPromise, generateEncodedProgramURL };
