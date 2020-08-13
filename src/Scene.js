// @flow

import React from 'react';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';
import { injectIntl } from 'react-intl';
import { sceneMinX, sceneMinY, sceneWidth, sceneHeight } from './Scene.scss';
import './Scene.scss';

type SceneProps = {
    intl: any,
    characterState: CharacterState
};

class Scene extends React.Component<SceneProps, {}> {
    render() {
        // Subtract 90 degrees from the character bearing as the character image is drawn upright when it is facing East
        const robotCharacterTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos}) rotate(${this.props.characterState.directionDegrees - 90} 0 0)`;

        return (
            <div>
                <span
                    className='Scene'
                    role='img'
                    aria-label={this.props.intl.formatMessage({id: 'Scene'})}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${sceneMinX} ${sceneMinY} ${sceneWidth} ${sceneHeight}`}>
                        <RobotCharacter robotCharacterTransform={robotCharacterTransform}/>
                    </svg>
                </span>
            </div>
        );
    }
}

export default injectIntl(Scene);
