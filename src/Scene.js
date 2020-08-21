// @flow

import React from 'react';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';
import { injectIntl } from 'react-intl';
import './Scene.scss';

type SceneProps = {
    intl: any,
    numRows: number,
    numColumns: number,
    gridCellWidth: number,
    characterState: CharacterState
};

class Scene extends React.Component<SceneProps, {}> {
    render() {
        const width = this.props.numColumns * this.props.gridCellWidth;
        const height = this.props.numRows * this.props.gridCellWidth;
        const minX = -width / 2;
        const minY = -height / 2;

        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        const robotCharacterTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos}) rotate(${this.props.characterState.directionDegrees - 90} 0 0)`;

        return (
            <div>
                <span
                    className='Scene'
                    role='img'
                    aria-label={this.props.intl.formatMessage({id: 'Scene'})}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${minX} ${minY} ${width} ${height}`}>
                        {this.props.characterState.path.map((pathSegment, i) => {
                            return <line
                                className='Scene__path-line'
                                x1={pathSegment.x1}
                                y1={pathSegment.y1}
                                x2={pathSegment.x2}
                                y2={pathSegment.y2}
                                key={`path-${i}`} />
                        })}
                        <RobotCharacter
                            robotCharacterTransform={robotCharacterTransform}
                            width={this.props.gridCellWidth * 0.8}
                        />
                    </svg>
                </span>
            </div>
        );
    }
}

export default injectIntl(Scene);
