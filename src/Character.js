// @flow

import React from 'react';
import RobotIcon from './svg/Robot.svg';
import './Character.scss';

type CharacterProps = {
    turtleTransform: string
};

export default class Character extends React.Component<CharacterProps, {}> {
    render() {
        return (
            <g transform={this.props.turtleTransform}>
                <defs>
                    <pattern id="character" width='1' height='1'>
                        <image className='Character' href={RobotIcon} />
                    </pattern>
                </defs>
                <circle className='Character__container' fill='url(#character)' />
            </g>
        );
    }
}
