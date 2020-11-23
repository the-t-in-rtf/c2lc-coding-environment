// @flow

import React from 'react';
import { ReactComponent as RabbitIcon } from './svg/Rabbit.svg';
import './RobotCharacter.scss';

type RobotCharacterProps = {
    transform: string,
    width: number
};

export default class RobotCharacter extends React.Component<RobotCharacterProps, {}> {
    render() {
        return (
            <g
                className='RobotCharacter'
                transform={this.props.transform}>
                <RabbitIcon
                    className='RobotCharacter__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            </g>
        );
    }
}
