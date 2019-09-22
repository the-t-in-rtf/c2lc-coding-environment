// @flow

import React from 'react';
import DashDriver from './DashDriver';
import * as FeatureDetection from './FeatureDetection';
import Interpreter from './Interpreter';
import type {Program} from './Interpreter';
import ProgramTextEditor from './ProgramTextEditor';
import TextSyntax from './TextSyntax';
import TurtleGraphics from './TurtleGraphics';
import './App.css';

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    dashSupport: boolean
}

type AppState = {
    program: Program,
    programVer: number,
    settings: AppSettings
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: DashDriver;
    interpreter: Interpreter;
    syntax: TextSyntax;
    turtleGraphicsRef: { current: null | TurtleGraphics };

    constructor(props: {}) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

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
            programVer: 1,
            settings: {
                dashSupport: this.appContext.bluetoothApiIsAvailable
            }
        };

        this.dashDriver = new DashDriver();
        this.interpreter = new Interpreter();
        this.syntax = new TextSyntax();
        this.turtleGraphicsRef = React.createRef<TurtleGraphics>();
    }

    setProgram(program: Program) {
        this.setState((state) => {
            return {
                program: program,
                programVer: state.programVer + 1
            }
        });
    }

    handleChangeProgram = (program: Program) => {
        this.setProgram(program);
    };

    handleClickRun = () => {
        this.interpreter.run(this.state.program);
    };

    handleClickConnectDash = () => {
        this.dashDriver.connect();
    };

    render() {
        // TODO: Don't configure the interpreter here -- render should have no side-efffects
        //     - Maybe use https://reactjs.org/docs/react-component.html#componentdidupdate
        // TODO: Don't make anonymous CommandHandlers each time we render
        // TODO: Register Dash CommandHandlers on successful connect, rather than on enable the feature support
        // TODO: When Dash is enabled, also draw on the screen
        // TODO: Show Dash connection status in the UI

        if (this.state.settings.dashSupport) {
            this.interpreter.setCommandHandlers({
                forward: () => {
                    this.dashDriver.forward();
                },
                left: () => {
                    this.dashDriver.left();
                },
                right: () => {
                    this.dashDriver.right();
                }
            });
        } else {
            this.interpreter.setCommandHandlers({
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
            });
        }

        return (
            <div>
                <ProgramTextEditor
                    program={this.state.program}
                    programVer={this.state.programVer}
                    syntax={this.syntax}
                    onChange={this.handleChangeProgram} />
                <div className='App__turtle-graphics'>
                    <TurtleGraphics ref={this.turtleGraphicsRef} />
                </div>
                <button onClick={this.handleClickRun}>Run</button>
                {this.state.settings.dashSupport &&
                    <button onClick={this.handleClickConnectDash}>Connect Dash</button>
                }
            </div>
        );
    }
}
