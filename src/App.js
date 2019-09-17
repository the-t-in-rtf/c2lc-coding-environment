// @flow

import React from 'react';
import Interpreter from './Interpreter';
import TurtleGraphics from './TurtleGraphics';

type AppState = {
    program: Array<string>
};

export default class App extends React.Component<{}, AppState> {
    interpreter: Interpreter;
    turtleGraphicsRef: { current: null | TurtleGraphics };

    constructor(props: {}) {
        super(props);

        this.state = {
            program: [
                "forward",
                "left",
                "forward",
                "left",
                "forward",
                "left",
                "forward",
                "left"
            ]
        };

        this.interpreter = new Interpreter(
            {
                forward: () => {
                    if (this.turtleGraphicsRef.current !== null) {
                        this.turtleGraphicsRef.current.forward(40);
                    }
                },
                left: () => {
                    if (this.turtleGraphicsRef.current !== null) {
                        this.turtleGraphicsRef.current.turnLeft(90);
                    }
                },
                right: () => {
                    if (this.turtleGraphicsRef.current !== null) {
                        this.turtleGraphicsRef.current.turnRight(90);
                    }
                }
            }
        );

        this.turtleGraphicsRef = React.createRef<TurtleGraphics>();

        this.handleClickRun = this.handleClickRun.bind(this);
    }

    handleClickRun: () => void;
    handleClickRun() {
        this.interpreter.run(this.state.program);
    }

    render() {
        return (
            <div>
                <div className='c2lc-graphics'>
                    <TurtleGraphics ref={this.turtleGraphicsRef} />
                </div>
                <button onClick={ this.handleClickRun }>Run</button>
            </div>
        );
    }
}
