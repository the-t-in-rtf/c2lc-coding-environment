// @flow

import React from 'react';
import {IntlProvider, FormattedMessage} from 'react-intl';
import CommandPalette from './CommandPalette';
import DashDriver from './DashDriver';
import DeviceConnectControl from './DeviceConnectControl';
import EditorContainer from './EditorContainer';
import * as FeatureDetection from './FeatureDetection';
import Interpreter from './Interpreter';
import MicMonitor from './MicMonitor';
import SoundexTable from './SoundexTable';
import TextSyntax from './TextSyntax';
import TurtleGraphics from './TurtleGraphics';
import WebSpeechInput from './WebSpeechInput';
import type {DeviceConnectionStatus, Program} from './types';
import { Col, Container, Dropdown, Form, Image, Row } from 'react-bootstrap';
import messages from './messages.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import playIcon from 'material-design-icons/av/svg/production/ic_play_arrow_48px.svg';


type AppContext = {
    bluetoothApiIsAvailable: boolean,
    speechRecognitionApiIsAvailable: boolean
};

type EditorMode = 'block' | 'text';

type AppSettings = {
    dashSupport: boolean,
    editorMode: EditorMode,
    language: string
}

type AppState = {
    program: Program,
    programVer: number,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    speechRecognitionOn: boolean,
    selectedCommand: string
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
                editorMode: 'text',
                language: 'en'
            },
            dashConnectionStatus: 'notConnected',
            speechRecognitionOn: false,
            selectedCommand: 'none'
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
        this.turtleGraphicsRef.current.clear();
        this.turtleGraphicsRef.current.home();
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

    handleModeChange = (event: any) => {
        let mode = event.target.name === 'text' ? 'text' : 'symbolic';
        this.setStateSettings({
            editorMode : mode
        });
    }
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

    handleAppendToProgram = (command: string) => {
        this.setState((state) => {
            return {
                program: this.state.program.concat([command]),
                programVer: state.programVer + 1
            }
        });
    };

    handleDeleteProgramBlock = (index: number) => {
        let currentProgram = this.state.program;
        currentProgram.splice(index, 1);
        this.setState((state) => {
            return {
                program: currentProgram,
                programVer: state.programVer + 1
            }
        });
    };

    handleAddEmptyProgramBlock = (index: number) => {
        let currentProgram = this.state.program;
        currentProgram.splice(index+1, 0, 'none');
        this.setState((state) => {
            return {
                program: currentProgram,
                programVer: state.programVer + 1
            }
        });
    };

    handleChangeProgramBlock = (index: number, command: string) => {
        let currentProgram = this.state.program;
        currentProgram.splice(index, 1, command);
        this.setState((state) => {
            return {
                program: currentProgram,
                programVer: state.programVer + 1 
            }
        });
    };

    handleCommandFromCommandPalette = (command: string) => {
        this.setState((state) => {
            return {
                selectedCommand: command
            }
        });
    };

    render() {
        return (
            <Container>
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                    <Row className='justify-content-center'>
                        <Col className='rm-3' md='auto'>
                            <Row>
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        Change Mode
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu onClick={this.handleModeChange}>
                                        <Dropdown.Item name='text'>Text</Dropdown.Item>
                                        <Dropdown.Item name='symbolic'>Symbolic</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row>
                                <EditorContainer 
                                    program={this.state.program}
                                    programVer={this.state.programVer}
                                    syntax={this.syntax}
                                    mode={this.state.settings.editorMode}
                                    onChange={this.handleChangeProgram} 
                                    addEmptyProgramBlock={this.handleAddEmptyProgramBlock}
                                    deleteProgramBlock={this.handleDeleteProgramBlock}
                                    changeProgramBlock={this.handleChangeProgramBlock}
                                    selectedCommand={this.state.selectedCommand}
                                    />
                            </Row>
                        </Col>
                        <Col md='auto'>
                            <Row>
                                {this.state.settings.dashSupport &&
                                    <DeviceConnectControl
                                            onClickConnect={this.handleClickConnectDash}
                                            connectionStatus={this.state.dashConnectionStatus}>
                                        <FormattedMessage id='App.connectToDash' />
                                    </DeviceConnectControl>
                                }
                            </Row>
                            <Row>
                                <div className='App__turtle-graphics'>
                                    <TurtleGraphics ref={this.turtleGraphicsRef} />
                                </div>
                            </Row>
                            <Row>
                                <button onClick={this.handleClickRun} aria-label={`Run current program ${this.state.program.join(' ')}`}>
                                    <Image src={playIcon} />
                                </button>
                            </Row>
                        </Col>
                    </Row>
                   <Row className='justify-content-center'>
                        <Col md='auto'>
                            <CommandPalette
                                program={this.state.program}
                                programVer={this.state.programVer}
                                onChange={this.handleAppendToProgram}
                                selectedCommand={this.handleCommandFromCommandPalette}
                            />
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col md='auto'>
                            <Form.Check 
                                type='switch'
                                id='custom-switch'
                                label='Speech Recognition'
                                disabled={!this.appContext.speechRecognitionApiIsAvailable}
                                checked={this.state.speechRecognitionOn}
                                //onClick={this.state.speechRecognitionOn ? this.handleStopSpeechRecognition : this.handleStartSpeechRecognition }
                                onChange={() => {
                                    this.setState({
                                        speechRecognitionOn : !this.state.speechRecognitionOn
                                    })
                                }}
                            />
                             <div>
                                <MicMonitor
                                    enabled = {this.state.speechRecognitionOn}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col className='align-content-flex-start' md='auto'>
                            <select
                                    value={this.state.settings.language}
                                    onChange={this.handleChangeLanguage}>
                                <option value='en'>English</option>
                                <option value='fr'>Français</option>
                            </select>
                        </Col>
                    </Row>
            </IntlProvider>
            </Container>
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
