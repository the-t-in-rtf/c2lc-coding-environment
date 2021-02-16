// @flow

import SceneDimensions from './SceneDimensions';

test('SceneDimensions properties', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.getWidth()).toBe(5);
    expect(dimensions.getHeight()).toBe(3);
    expect(dimensions.getMinX()).toBe(-0.5);
    expect(dimensions.getMinY()).toBe(-0.5);
    expect(dimensions.getMaxX()).toBe(4.5);
    expect(dimensions.getMaxY()).toBe(2.5);
});

test('SceneDimensions.getBoundsStateX()', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.getBoundsStateX(0)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(2.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(3)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(5.5)).toBe('outOfBoundsAbove');
    expect(dimensions.getBoundsStateX(-2.51)).toBe('outOfBoundsBelow');
});

test('SceneDimensions.getBoundsStateY()', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.getBoundsStateY(0)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(1.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(2.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(4)).toBe('outOfBoundsAbove');
    expect(dimensions.getBoundsStateY(-1.51)).toBe('outOfBoundsBelow');
});
