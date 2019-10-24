// @flow

import React from 'react';
import {IntlProvider, FormattedMessage} from 'react-intl';
import DashDriver from './DashDriver';
import DeviceConnectControl from './DeviceConnectControl';
import * as FeatureDetection from './FeatureDetection';
import Interpreter from './Interpreter';
import MicMonitor from './MicMonitor';
import ProgramTextEditor from './ProgramTextEditor';
import SoundexTable from './SoundexTable';
import TextSyntax from './TextSyntax';
import TurtleGraphics from './TurtleGraphics';
import WebSpeechInput from './WebSpeechInput';
import type {DeviceConnectionStatus, Program} from './types';
import messages from './messages.json';
import './App.css';

type AppContext = {
    bluetoothApiIsAvailable: boolean,
    speechRecognitionApiIsAvailable: boolean
};

type AppSettings = {
    dashSupport: boolean,
    language: string
}

type AppState = {
    program: Program,
    programVer: number,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    speechRecognitionOn: boolean
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: DashDriver;
    interpreter: Interpreter;
    syntax: TextSyntax;
    turtleGraphicsRef: { current: null | TurtleGraphics };
    webSpeechInput: WebSpeechInput;

    constructor(props: {}) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable(),
            speechRecognitionApiIsAvailable: FeatureDetection.speechRecognitionApiIsAvailable()
        };

        this.state = {
            program: [
                'forward',
                'left',
                'forward',
                'left',
                'forward',
                'left',
                'forward',
                'left'
            ],
            programVer: 1,
            settings: {
                dashSupport: this.appContext.bluetoothApiIsAvailable,
                language: 'en'
            },
            dashConnectionStatus: 'notConnected',
            speechRecognitionOn: false
        };

        this.interpreter = new Interpreter();
        this.interpreter.addCommandHandler(
            'forward',
            'turtleGraphics',
            () => {
                if (this.turtleGraphicsRef.current !== null) {
                    return this.turtleGraphicsRef.current.forward(40);
                } else {
                    return Promise.reject();
                }
            }
        );
        this.interpreter.addCommandHandler(
            'left',
            'turtleGraphics',
            () => {
                if (this.turtleGraphicsRef.current !== null) {
                    return this.turtleGraphicsRef.current.turnLeft(90);
                } else {
                    return Promise.reject();
                }
            }
        );
        this.interpreter.addCommandHandler(
            'right',
            'turtleGraphics',
            () => {
                if (this.turtleGraphicsRef.current !== null) {
                    return this.turtleGraphicsRef.current.turnRight(90);
                } else {
                    return Promise.reject();
                }
            }
        );

        this.dashDriver = new DashDriver();
        this.syntax = new TextSyntax();
        this.turtleGraphicsRef = React.createRef<TurtleGraphics>();

        if (this.appContext.speechRecognitionApiIsAvailable) {
            const soundexTable = new SoundexTable([
                { pattern: /F6../, word: 'forward' },
                { pattern: /O6../, word: 'forward' },
                { pattern: /L1../, word: 'left' },
                { pattern: /L2../, word: 'left' },
                { pattern: /L3../, word: 'left' },
                { pattern: /L.3./, word: 'left' },
                { pattern: /L..3/, word: 'left' },
                { pattern: /R3../, word: 'right' },
                { pattern: /R.3./, word: 'right' },
                { pattern: /R..3/, word: 'right' }
            ]);

            this.webSpeechInput = new WebSpeechInput(
                soundexTable,
                this.handleSpeechCommand);
        }
    }

    setProgram(program: Program) {
        this.setState((state) => {
            return {
                program: program,
                programVer: state.programVer + 1
            }
        });
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
    }

    handleChangeLanguage = (event: SyntheticEvent<HTMLSelectElement>) => {
        this.setStateSettings({
            language: event.currentTarget.value
        });
    };

    handleChangeProgram = (program: Program) => {
        this.setProgram(program);
    };

    handleClickRun = () => {
        this.interpreter.run(this.state.program);
    };

    handleClickConnectDash = () => {
        this.setState({
            dashConnectionStatus: 'connecting'
        });
        this.dashDriver.connect().then(() => {
            this.setState({
                dashConnectionStatus: 'connected'
            });
        }, (error) => {
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
            this.setState({
                dashConnectionStatus: 'notConnected'
            });
        });
    };

    handleStartSpeechRecognition = () => {
        this.setState({
            speechRecognitionOn: true
        });
    };

    handleStopSpeechRecognition = () => {
        this.setState({
            speechRecognitionOn: false
        });
    };

    handleSpeechCommand = (word: string) => {
        this.interpreter.doCommand(word);
    };

    render() {
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                <div>
                    <select
                            value={this.state.settings.language}
                            onChange={this.handleChangeLanguage}>
                        <option value='en'>English</option>
                        <option value='fr'>Français</option>
                    </select>
                    <ProgramTextEditor
                        program={this.state.program}
                        programVer={this.state.programVer}
                        syntax={this.syntax}
                        onChange={this.handleChangeProgram} />
                    <div className='App__turtle-graphics'>
                        <TurtleGraphics ref={this.turtleGraphicsRef} />
                    </div>
                    <button onClick={this.handleClickRun}>
                        <FormattedMessage id='App.run' />
                    </button>
                    {this.state.settings.dashSupport &&
                        <DeviceConnectControl
                                onClickConnect={this.handleClickConnectDash}
                                connectionStatus={this.state.dashConnectionStatus}>
                            <FormattedMessage id='App.connectToDash' />
                        </DeviceConnectControl>
                    }
                    {this.appContext.speechRecognitionApiIsAvailable &&
                        <div>
                            <button onClick={this.handleStartSpeechRecognition}>
                                <FormattedMessage id='App.startSpeechRecognition' />
                            </button>
                            <button onClick={this.handleStopSpeechRecognition}>
                                <FormattedMessage id='App.stopSpeechRecognition' />
                            </button>
                            <div>
                                <MicMonitor
                                    enabled = {this.state.speechRecognitionOn}
                                />
                            </div>
                        </div>
                    }
                </div>
            </IntlProvider>
        );
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        // Dash Connection Status
        if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
            console.log(this.state.dashConnectionStatus);

            // TODO: Handle Dash disconnection

            if (this.state.dashConnectionStatus === 'connected') {
                this.interpreter.addCommandHandler('forward', 'dash',
                    this.dashDriver.forward.bind(this.dashDriver));
                this.interpreter.addCommandHandler('left', 'dash',
                    this.dashDriver.left.bind(this.dashDriver));
                this.interpreter.addCommandHandler('right', 'dash',
                    this.dashDriver.right.bind(this.dashDriver));
            }
        }

        // Speech Recognition
        if (this.state.speechRecognitionOn !== prevState.speechRecognitionOn) {
            if (this.state.speechRecognitionOn) {
                this.webSpeechInput.start();
            } else {
                this.webSpeechInput.stop();
            }
        }
    }
}
