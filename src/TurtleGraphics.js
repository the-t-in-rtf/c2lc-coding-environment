// @flow

import React from 'react';
import * as C2lcMath from './C2lcMath';
import './TurtleGraphics.css';

type TurtleGraphicsState = {
    location: {
        x: number,
        y: number
    },
    directionDegrees: number,
    path: Array<{
        x1: number,
        y1: number,
        x2: number,
        y2: number
    }>
};

export default class TurtleGraphics extends React.Component<{}, TurtleGraphicsState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            location: {
                x: 0,
                y: 0
            },
            directionDegrees: 0,
            path: []
        }
    }

    forward(distance: number): Promise<void> {
        this.setState((state) => {
            const directionRadians = C2lcMath.degrees2radians(state.directionDegrees);
            const xOffset = Math.sin(directionRadians) * distance;
            const yOffset = Math.cos(directionRadians) * distance;

            const newX = state.location.x + xOffset;
            const newY = state.location.y - yOffset;
            const newPathSegment = {
                x1: state.location.x,
                y1: state.location.y,
                x2: newX,
                y2: newY
            };

            return {
                location: {
                    x: newX,
                    y: newY
                },
                path: state.path.concat([newPathSegment])
            }
        });

        return Promise.resolve();
    }

    turnLeft(amountDegrees: number): Promise<void> {
        this.setState((state) => {
            return {
                directionDegrees: C2lcMath.wrap(0, 360,
                    state.directionDegrees - amountDegrees)
            };
        });

        return Promise.resolve();
    }

    turnRight(amountDegrees: number): Promise<void> {
        this.setState((state) => {
            return {
                directionDegrees: C2lcMath.wrap(0, 360,
                    state.directionDegrees + amountDegrees)
            };
        });

        return Promise.resolve();
    }

    home(): void {
        this.setState({
            location: {
                x: 0,
                y: 0
            },
            directionDegrees: 0
        });
    }

    clear(): void {
        this.setState({
            path: []
        });
    }

    render() {
        const turtleTransform = `translate(${this.state.location.x} ${this.state.location.y}) rotate(${this.state.directionDegrees} 0 0)`;

        return (
            <div>
                <span
                    className='TurtleGraphics__drawing-area'
                    role='img'
                    aria-label='Drawing area'>
                    <svg
                        className='TurtleGraphics__svg'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='-100 -100 200 200'>
                        {this.state.path.map((pathSegment, i) => {
                            return <line
                                x1={pathSegment.x1}
                                y1={pathSegment.y1}
                                x2={pathSegment.x2}
                                y2={pathSegment.y2}
                                key={i} />
                        })}
                        <polygon
                            className='TurtleGraphics__turtle'
                            transform={turtleTransform}
                            points='-6 4 6 4 0 -9'/>
                    </svg>
                </span>
            </div>
        );
    }
}
