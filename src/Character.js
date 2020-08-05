// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import './Character.scss';

type CharacterProps = {
    characterTransform: string
};

export default class Character extends React.Component<CharacterProps, {}> {
    render() {
        return (
            <g transform={this.props.characterTransform}>
                <RobotIcon className='Character' x='-18' y='-18' width='36' height='36' />
                <circle className='Character__container' r='20' />
            </g>
        );
    }
}
