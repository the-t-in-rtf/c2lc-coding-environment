// @flow

import React from 'react';
import Interpreter from './Interpreter';
import type {Program} from './Interpreter';
import ProgramTextEditor from './ProgramTextEditor';
import TextSyntax from './TextSyntax';
import TurtleGraphics from './TurtleGraphics';

type AppState = {
    program: Program,
    programVer: number
};

export default class App extends React.Component<{}, AppState> {
    interpreter: Interpreter;
    syntax: TextSyntax;
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
            ],
            programVer: 1
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

        this.syntax = new TextSyntax();
        this.turtleGraphicsRef = React.createRef<TurtleGraphics>();

        this.setProgram = this.setProgram.bind(this);
        this.handleClickRun = this.handleClickRun.bind(this);
    }

    setProgram: (Program) => void;
    setProgram(program: Program) {
        this.setState((state) => {
            return {
                program: program,
                programVer: state.programVer + 1
            }
        });
    }

    handleClickRun: () => void;
    handleClickRun() {
        this.interpreter.run(this.state.program);
    }

    render() {
        return (
            <div>
                <ProgramTextEditor
                    program={this.state.program}
                    programVer={this.state.programVer}
                    syntax={this.syntax}
                    onChange={this.setProgram} />
                <div className='c2lc-graphics'>
                    <TurtleGraphics ref={this.turtleGraphicsRef} />
                </div>
                <button onClick={this.handleClickRun}>Run</button>
            </div>
        );
    }
}
