// @flow

import SceneDimensions from './SceneDimensions';

test('SceneDimensions', () => {
    const dimensions = new SceneDimensions(2, 3, 100);
    expect(dimensions.getNumRows()).toBe(2);
    expect(dimensions.getNumColumns()).toBe(3);
    expect(dimensions.getGridCellWidth()).toBe(100);
    expect(dimensions.getWidth()).toBe(300);
    expect(dimensions.getHeight()).toBe(200);
    expect(dimensions.getMinX()).toBe(-150);
    expect(dimensions.getMinY()).toBe(-100);
    expect(dimensions.getBounds()).toStrictEqual({
        minX: -150,
        minY: -100,
        maxX: 150,
        maxY: 100
    });
});
