// @flow

import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Row } from 'react-bootstrap';
import AudioManager from './AudioManager';
import CharacterState from './CharacterState';
import CommandPaletteCommand from './CommandPaletteCommand';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import * as FeatureDetection from './FeatureDetection';
import FocusTrapManager from './FocusTrapManager';
import Interpreter from './Interpreter';
import type { InterpreterRunningState } from './Interpreter';
import PlayButton from './PlayButton';
import ProgramBlockEditor from './ProgramBlockEditor';
import RefreshButton from './RefreshButton';
import Scene from './Scene';
import AudioFeedbackToggleSwitch from './AudioFeedbackToggleSwitch';
import PenDownToggleSwitch from './PenDownToggleSwitch';
import { programIsEmpty } from './ProgramUtils';
import type { DeviceConnectionStatus, Program, RobotDriver } from './types';
import * as Utils from './Utils';
import messages from './messages.json';
import './App.scss';
import './vendor/dragdroptouch/DragDropTouch.js';

// Uncomment after 0.5 release
// import BluetoothApiWarning from './BluetoothApiWarning';
// import DeviceConnectControl from './DeviceConnectControl';

// Uncomment to use the FakeRobotDriver (see driver construction below also)
//import FakeRobotDriver from './FakeRobotDriver';

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    language: string,
    addNodeExpandedMode: boolean
};

type AppState = {
    program: Program,
    characterState: CharacterState,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    activeProgramStepNum: ?number,
    interpreterIsRunning: boolean,
    showDashConnectionError: boolean,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    audioEnabled: boolean,
    actionPanelStepIndex: ?number,
    sceneNumRows: number,
    sceneNumColumns: number,
    sceneGridCellWidth: number,
    drawingEnabled: boolean
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    audioManager: AudioManager;
    focusTrapManager: FocusTrapManager;
    startingCharacterState: CharacterState;

    constructor(props: {}) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        // Begin facing East
        this.startingCharacterState = new CharacterState(0, 0, 2, []);

        this.state = {
            program: [],
            characterState: this.startingCharacterState,
            settings: {
                language: 'en',
                addNodeExpandedMode: true
            },
            dashConnectionStatus: 'notConnected',
            activeProgramStepNum: null,
            interpreterIsRunning: false,
            showDashConnectionError: false,
            selectedAction: null,
            isDraggingCommand: false,
            audioEnabled: true,
            actionPanelStepIndex: null,
            sceneNumRows: 9,
            sceneNumColumns: 17,
            sceneGridCellWidth: 1,
            drawingEnabled: true
        };

        this.interpreter = new Interpreter(this.handleRunningStateChange);

        this.interpreter.addCommandHandler(
            'forward1',
            'moveCharacter',
            () => {
                this.audioManager.playSound('forward1');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.forward(
                            1,
                            state.drawingEnabled
                        )
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'forward2',
            'moveCharacter',
            () => {
                this.audioManager.playSound('forward2');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.forward(
                            2,
                            state.drawingEnabled
                        )
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'forward3',
            'moveCharacter',
            () => {
                this.audioManager.playSound('forward3');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.forward(
                            3,
                            state.drawingEnabled
                        )
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'left45',
            'moveCharacter',
            () => {
                this.audioManager.playSound('left45');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnLeft(1)
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'left90',
            'moveCharacter',
            () => {
                this.audioManager.playSound('left90');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnLeft(2)
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'left180',
            'moveCharacter',
            () => {
                this.audioManager.playSound('left180');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnLeft(4)
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'right45',
            'moveCharacter',
            () => {
                this.audioManager.playSound('right45');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnRight(1)
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'right90',
            'moveCharacter',
            () => {
                this.audioManager.playSound('right90');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnRight(2)
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        this.interpreter.addCommandHandler(
            'right180',
            'moveCharacter',
            () => {
                this.audioManager.playSound('right180');
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnRight(4)
                    };
                });
                return Utils.makeDelayedPromise(1750);
            }
        );

        // For FakeRobotDriver, replace with:
        // this.dashDriver = new FakeRobotDriver();
        this.dashDriver = new DashDriver();

        this.audioManager = new AudioManager(this.state.audioEnabled);

        this.focusTrapManager = new FocusTrapManager();
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
    }

    getSelectedCommandName() {
        if (this.state.selectedAction !== null) {
            return this.state.selectedAction;
        } else {
            return null;
        }
    }

    handleChangeProgram = (program: Program) => {
        this.setState({
            program: program
        });
    };

    handleClickPlay = () => {
        this.interpreter.run(this.state.program).then(
            () => {}, // Do nothing on successful resolution
            (error: Error) => {
                console.log(error.name);
                console.log(error.message);
            }
        );
    };

    handleClickConnectDash = () => {
        this.setState({
            dashConnectionStatus: 'connecting',
            showDashConnectionError: false
        });
        this.dashDriver.connect(this.handleDashDisconnect).then(() => {
            this.setState({
                dashConnectionStatus: 'connected'
            });
        }, (error: Error) => {
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
            this.setState({
                dashConnectionStatus: 'notConnected',
                showDashConnectionError: true
            });
        });
    };

    handleCancelDashConnection = () => {
        this.setState({
            showDashConnectionError: false
        });
    };

    handleDashDisconnect = () => {
        this.setState({
            dashConnectionStatus : 'notConnected'
        });
    };

    handleCommandFromCommandPalette = (command: ?string) => {
        if (command) {
            this.setState({
                selectedAction: command
            });
        } else {
            this.setState({
                selectedAction: null
            });
        }
    };

    handleDragStartCommand = (command: string) => {
        this.setState({
            isDraggingCommand: true,
            selectedAction: command,
            actionPanelStepIndex: null
        });
    };

    handleDragEndCommand = () => {
        this.setState({ isDraggingCommand: false });
    };

    handleRunningStateChange = ( interpreterRunningState : InterpreterRunningState) => {
        this.setState({
            activeProgramStepNum: interpreterRunningState.activeStep,
            interpreterIsRunning: interpreterRunningState.isRunning
        });
    };

    handleChangeActionPanelStepIndex = (index: ?number) => {
        this.setState({
            actionPanelStepIndex: index
        });
    };

    handleChangeAddNodeExpandedMode = (isAddNodeExpandedMode: boolean) => {
        this.setStateSettings({
            addNodeExpandedMode: isAddNodeExpandedMode
        });
    };

    handleRootClick = (e: SyntheticInputEvent<HTMLInputElement>) => {
        let element = e.target;
        // Walk up the document tree until we hit the top, or we find that
        // we are within an action panel group area
        while (element != null && element.dataset) {
            if (element.dataset.actionpanelgroup) {
                // We are within an action panel group area, stop looking
                return;
            }
            element = element.parentElement;
        }
        // We hit the top, close the action panel
        this.setState({
            actionPanelStepIndex: null
        });
    };

    handleRootKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.focusTrapManager.handleKeyDown(e);
    };

    handleToggleAudioFeedback = (audioEnabled: boolean) => {
        this.setState({
            audioEnabled: audioEnabled
        });
    }

    handleTogglePenDown = (drawingEnabled: boolean) => {
        this.setState({
            drawingEnabled: drawingEnabled
        });
    }

    renderCommandBlocks = () => {
        const commandNames = [
            'forward1', 'forward2', 'forward3',
            'left45', 'left90', 'left180',
            'right45', 'right90', 'right180'
        ];
        const commandBlocks = [];

        for (const [index, value] of commandNames.entries()) {
            commandBlocks.push(
                <CommandPaletteCommand
                    key={`CommandBlock-${index}`}
                    commandName={value}
                    selectedCommandName={this.getSelectedCommandName()}
                    audioManager={this.audioManager}
                    onChange={this.handleCommandFromCommandPalette}
                    onDragStart={this.handleDragStartCommand}
                    onDragEnd={this.handleDragEndCommand}/>
            )
        }

        return commandBlocks;
    }

    handleRefresh = () => {
        this.setState({
            characterState: this.startingCharacterState
        });
    }

    render() {
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                <div
                    onClick={this.handleRootClick}
                    onKeyDown={this.handleRootKeyDown}>
                    <header className='App__header'>
                        <Container>
                            <Row className='App__header-row'>
                                <h1 className='App__app-heading'>
                                    <FormattedMessage id='App.appHeading'/>
                                </h1>
                                <div className='App__header-right'>
                                    <div className='App__audio-toggle-switch'>
                                        <AudioFeedbackToggleSwitch
                                            value={this.state.audioEnabled}
                                            onChange={this.handleToggleAudioFeedback} />
                                    </div>
                                    {/* Uncomment after 0.5 release
                                    <DeviceConnectControl
                                        disabled={
                                            !this.appContext.bluetoothApiIsAvailable ||
                                            this.state.dashConnectionStatus === 'connected' }
                                        connectionStatus={this.state.dashConnectionStatus}
                                        onClickConnect={this.handleClickConnectDash}>
                                        <FormattedMessage id='App.connectToDash' />
                                    </DeviceConnectControl> */}
                                </div>
                            </Row>
                        </Container>
                    </header>
                    <Container role='main' className='mb-5'>
                        {/* Uncomment after 0.5 release
                        {!this.appContext.bluetoothApiIsAvailable &&
                            <Row className='App__bluetooth-api-warning-section'>
                                <Col>
                                    <BluetoothApiWarning/>
                                </Col>
                            </Row>
                        } */}
                        <div className='App__scene-container'>
                            <Scene
                                numRows={this.state.sceneNumRows}
                                numColumns={this.state.sceneNumColumns}
                                gridCellWidth={this.state.sceneGridCellWidth}
                                characterState={this.state.characterState}
                            />
                            <div className='App__scene-controls'>
                                <div className='App__playButton-container'>
                                    <PlayButton
                                        interpreterIsRunning={this.state.interpreterIsRunning}
                                        disabled={
                                            this.state.interpreterIsRunning ||
                                            programIsEmpty(this.state.program)}
                                        onClick={this.handleClickPlay}
                                    />
                                </div>
                                <div className='App__refreshButton-container'>
                                    <RefreshButton
                                        disabled={this.state.interpreterIsRunning}
                                        onClick={this.handleRefresh}
                                    />
                                </div>
                                <div className='App__penDown-toggle-switch-container'>
                                    <PenDownToggleSwitch
                                        className='App__penDown-toggle-switch'
                                        value={this.state.drawingEnabled}
                                        onChange={this.handleTogglePenDown}/>
                                </div>
                            </div>
                        </div>
                        <Row className='App__program-section' noGutters={true}>
                            <Col md={5} lg={4} className='pr-md-4 mb-4 mb-md-0'>
                                <div className='App__command-palette'>
                                    <h2 className='App__command-palette-heading'>
                                        <FormattedMessage id='CommandPalette.movementsTitle' />
                                    </h2>
                                    <div className='App__command-palette-commands'>
                                        {this.renderCommandBlocks()}
                                    </div>
                                </div>
                            </Col>
                            <Col md={7} lg={8}>
                                <ProgramBlockEditor
                                    activeProgramStepNum={this.state.activeProgramStepNum}
                                    actionPanelStepIndex={this.state.actionPanelStepIndex}
                                    editingDisabled={this.state.interpreterIsRunning === true}
                                    interpreterIsRunning={this.state.interpreterIsRunning}
                                    program={this.state.program}
                                    selectedAction={this.state.selectedAction}
                                    isDraggingCommand={this.state.isDraggingCommand}
                                    audioManager={this.audioManager}
                                    focusTrapManager={this.focusTrapManager}
                                    addNodeExpandedMode={this.state.settings.addNodeExpandedMode}
                                    onChangeProgram={this.handleChangeProgram}
                                    onChangeActionPanelStepIndex={this.handleChangeActionPanelStepIndex}
                                    onChangeAddNodeExpandedMode={this.handleChangeAddNodeExpandedMode}
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
            </IntlProvider>
        );
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        if (this.state.audioEnabled !== prevState.audioEnabled) {
            this.audioManager.setAudioEnabled(this.state.audioEnabled);
        }
        // Uncomment after 0.5 release
        // if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
        //     console.log(this.state.dashConnectionStatus);

        //     if (this.state.dashConnectionStatus === 'connected') {
        //         this.interpreter.addCommandHandler('forward', 'dash',
        //             this.dashDriver.forward.bind(this.dashDriver));
        //         this.interpreter.addCommandHandler('left', 'dash',
        //             this.dashDriver.left.bind(this.dashDriver));
        //         this.interpreter.addCommandHandler('right', 'dash',
        //             this.dashDriver.right.bind(this.dashDriver));
        //     } else if (this.state.dashConnectionStatus === 'notConnected') {
        //         // TODO: Remove Dash handlers

        //         if (this.state.interpreterIsRunning) {
        //             this.interpreter.stop();
        //         }
        //     }
        // }
    }
}
