// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import { characterRadius, characterWidth, characterHeight } from './RobotCharacter.scss'
import './RobotCharacter.scss';

type RobotCharacterProps = {
    robotCharacterTransform: string
};

export default class RobotCharacter extends React.Component<RobotCharacterProps, {}> {
    render() {
        return (
            <g transform={this.props.robotCharacterTransform}>
                <RobotIcon
                    className='RobotCharacter'
                    x={`${-characterWidth/2}`}
                    y={`${-characterHeight/2}`}
                    width={`${characterWidth}`}
                    height={`${characterHeight}`} />
                <circle className='RobotCharacter__container' r={`${characterRadius}`} />
            </g>
        );
    }
}
