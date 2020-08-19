// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import Scene from './Scene';

configure({ adapter: new Adapter()});

const mockCharacterState : any = {
    xPos: 0,
    yPos: 0,
    directionDegrees: 90
};

const defaultSceneProps = {
    numRows: 1,
    numColumns: 1,
    gridCellWidth: 10
};

function createMountScene(props) {
    const wrapper = mount(
        React.createElement(
            Scene,
            Object.assign(
                {},
                defaultSceneProps,
                {
                    characterState: mockCharacterState
                },
                props
            )
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return wrapper;
}

function findGridLines(sceneWrapper) {
    return sceneWrapper.find('.Scene__grid-line');
}

function findGridLabels(sceneWrapper) {
    return sceneWrapper.find('.Scene__grid-label');
}

function findCharacter(sceneWrapper) {
    return sceneWrapper.find('.RobotCharacter');
}

describe('When the Scene renders', () => {
    test.each([
        [ 2, 3, 10],
        [ 0, 2, 2],
        [ 1, 0, 4],
        [ 0, 0, 2],
        [9, 5, 10]
    ]) ('Should have right number of lines and labels',
        (numRows, numColumns, gridCellWidth) => {
            expect.assertions(2);
            const sceneWrapper = createMountScene({
                numRows,
                numColumns,
                gridCellWidth});
            if (numRows === 0 || numColumns === 0) {
                expect(findGridLines(sceneWrapper).length).toBe(0);
                expect(findGridLabels(sceneWrapper).length).toBe(0);
            } else {
                expect(findGridLines(sceneWrapper).length).toBe(numRows-1 + numColumns-1);
                expect(findGridLabels(sceneWrapper).length).toBe(numRows + numColumns);
            }
        }
    );
});

describe('When the Scene renders', () => {
    test('Should render character component', () => {
        const sceneWrapper = createMountScene();
        expect(findCharacter(sceneWrapper).hostNodes().length).toBe(1);
    });
})
