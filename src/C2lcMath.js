// @flow

function approxEqual(a: number, b: number, epsilon: number): boolean {
    return Math.abs(a - b) < epsilon;
}

function clamp(value: number, lower: number, upper: number): number {
    if (value < lower) {
        return lower;
    } else if (value > upper) {
        return upper;
    }
    return value;
}

function degrees2radians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function wrap(start: number, stop: number, val: number): number {
    return val - (Math.floor((val - start) / (stop - start)) * (stop - start));
}

export { approxEqual, clamp, degrees2radians, wrap };
