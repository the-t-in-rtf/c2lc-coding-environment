// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import './RobotCharacter.scss';

type RobotCharacterProps = {
    robotCharacterTransform: string
};

export default class RobotCharacter extends React.Component<RobotCharacterProps, {}> {
    render() {
        return (
            <g transform={this.props.robotCharacterTransform}>
                <RobotIcon className='RobotCharacter' x='-15' y='-15' width='30' height='30' />
                <circle className='RobotCharacter__container' r='20' />
            </g>
        );
    }
}
