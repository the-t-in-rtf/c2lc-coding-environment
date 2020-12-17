// @flow

import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Row } from 'react-bootstrap';
import AudioManager from './AudioManager';
import CharacterState from './CharacterState';
import CharacterStateSerializer from './CharacterStateSerializer';
import CommandPaletteCommand from './CommandPaletteCommand';
import C2lcURLParams from './C2lcURLParams';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import * as FeatureDetection from './FeatureDetection';
import FocusTrapManager from './FocusTrapManager';
import Interpreter from './Interpreter';
import PlayButton from './PlayButton';
import ProgramBlockEditor from './ProgramBlockEditor';
import RefreshButton from './RefreshButton';
import Scene from './Scene';
import SceneDimensions from './SceneDimensions';
import AudioFeedbackToggleSwitch from './AudioFeedbackToggleSwitch';
import PenDownToggleSwitch from './PenDownToggleSwitch';
import ProgramSequence from './ProgramSequence';
import ProgramSpeedController from './ProgramSpeedController';
import ProgramSerializer from './ProgramSerializer';
import ShareButton from './ShareButton';
import type { DeviceConnectionStatus, Program, RobotDriver, RunningState } from './types';
import * as Utils from './Utils';
import messages from './messages.json';
import './App.scss';
import './vendor/dragdroptouch/DragDropTouch.js';
/* Dash connection removed for version 0.5
import BluetoothApiWarning from './BluetoothApiWarning';
import DeviceConnectControl from './DeviceConnectControl';
*/

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
    programSequence: ProgramSequence,
    characterState: CharacterState,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    showDashConnectionError: boolean,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    audioEnabled: boolean,
    actionPanelStepIndex: ?number,
    sceneDimensions: SceneDimensions,
    drawingEnabled: boolean,
    runningState: RunningState
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    audioManager: AudioManager;
    focusTrapManager: FocusTrapManager;
    startingCharacterState: CharacterState;
    programSerializer: ProgramSerializer;
    characterStateSerializer: CharacterStateSerializer;
    speedLookUp: Array<number>;

    constructor(props: any) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        // Begin facing East
        this.startingCharacterState = new CharacterState(0, 0, 2, []);

        this.state = {
            program: [],
            programSequence: new ProgramSequence([], 0),
            characterState: this.startingCharacterState,
            settings: {
                language: 'en',
                addNodeExpandedMode: true
            },
            dashConnectionStatus: 'notConnected',
            showDashConnectionError: false,
            selectedAction: null,
            isDraggingCommand: false,
            audioEnabled: true,
            actionPanelStepIndex: null,
            sceneDimensions: new SceneDimensions(17, 9),
            drawingEnabled: true,
            runningState: 'stopped'
        };

        this.interpreter = new Interpreter(1000, this.state.programSequence, this.incrementProgramCounter, this.handleRunningStateChange);

        this.speedLookUp = [2000, 1500, 1000, 500, 250];

        this.programSerializer = new ProgramSerializer();

        this.characterStateSerializer = new CharacterStateSerializer();

        this.interpreter.addCommandHandler(
            'forward1',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward1');
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(1, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("movement", stepTimeMs, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'forward2',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward2');
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(2, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("movement", stepTimeMs, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'forward3',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward3');
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(3, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("movement", stepTimeMs, newCharacterState);
                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left45',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 45 degree to take 1/4 of that.
                const soundTime = stepTimeMs / 4;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left45');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left90',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 90 degree turn to take 1/2 of that.
                const soundTime = stepTimeMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left90');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left180',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left180');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", stepTimeMs,  newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right45',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 45 degree turn to take 1/4 of that.
                const soundTime = stepTimeMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right45');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right90',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 90 degree to take 1/2 of that.
                const soundTime = stepTimeMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right90');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right180',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right180');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", stepTimeMs, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
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

    incrementProgramCounter = (programCounter: number) => {
        this.setState((state) => {
            return {
                programSequence: state.programSequence.incrementProgramCounter()
            }
        });
    };

    resetProgramCounter = () => {
        this.setState((state) => {
            return {
                programSequence: state.programSequence.updateProgramCounter(0)
            }
        });
    };

    handleRunningStateChange = (runningState: RunningState) => {
        this.setState({ runningState });
    }

    handleChangeProgram = (program: Program) => {
        this.setState({
            program: program
        });
    };

    handleProgramSequenceChange = (programSequence: ProgramSequence) => {
        this.setState({ programSequence });
    }

    handleClickPlay = () => {
        this.setState((state) => {
            return {
                programSequence: state.programSequence.updateProgramCounter(0),
                runningState: 'running'
            }
        });
        // this.interpreter.run(this.state.programSequence.getProgram()).then(
        //     () => {}, // Do nothing on successful resolution
        //     (error: Error) => {
        //         console.log(error.name);
        //         console.log(error.message);
        //     }
        // );
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

    handleChangeProgramSpeed = (stepTimeMs: number) => {
        this.interpreter.setStepTime(stepTimeMs);
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
                                    {/* Dash connection removed for version 0.5
                                    <DeviceConnectControl
                                        disabled={
                                            !this.appContext.bluetoothApiIsAvailable ||
                                            this.state.dashConnectionStatus === 'connected' }
                                        connectionStatus={this.state.dashConnectionStatus}
                                        onClickConnect={this.handleClickConnectDash}>
                                        <FormattedMessage id='App.connectToDash' />
                                    </DeviceConnectControl>
                                    */}
                                </div>
                            </Row>
                        </Container>
                    </header>
                    <Container role='main' className='mb-5'>
                        {/* Dash connection removed for version 0.5
                        {!this.appContext.bluetoothApiIsAvailable &&
                            <Row className='App__bluetooth-api-warning-section'>
                                <Col>
                                    <BluetoothApiWarning/>
                                </Col>
                            </Row>
                        }
                        */}
                        <div className='App__scene-container'>
                            <Scene
                                dimensions={this.state.sceneDimensions}
                                characterState={this.state.characterState}
                            />
                            <div className='App__scene-controls'>
                                <div className='App__scene-controls-group'>
                                    <div className='App__penDown-toggle-switch-container'>
                                        <PenDownToggleSwitch
                                            className='App__penDown-toggle-switch'
                                            value={this.state.drawingEnabled}
                                            onChange={this.handleTogglePenDown}/>
                                    </div>
                                    <div className='App__refreshButton-container'>
                                        <RefreshButton
                                            disabled={this.state.runningState === 'running'}
                                            onClick={this.handleRefresh}
                                        />
                                    </div>
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
                                    actionPanelStepIndex={this.state.actionPanelStepIndex}
                                    editingDisabled={this.state.runningState === 'running'}
                                    programSequence={this.state.programSequence}
                                    runningState={this.state.runningState}
                                    selectedAction={this.state.selectedAction}
                                    isDraggingCommand={this.state.isDraggingCommand}
                                    audioManager={this.audioManager}
                                    focusTrapManager={this.focusTrapManager}
                                    addNodeExpandedMode={this.state.settings.addNodeExpandedMode}
                                    onChangeProgramSequence={this.handleProgramSequenceChange}
                                    onChangeActionPanelStepIndex={this.handleChangeActionPanelStepIndex}
                                    onChangeAddNodeExpandedMode={this.handleChangeAddNodeExpandedMode}
                                />
                            </Col>
                        </Row>
                        <div className='App__playAndShare-container'>
                            <div className='App__playControl-container'>
                                <div className='App__playButton-container'>
                                    <PlayButton
                                        interpreterIsRunning={this.state.runningState === 'running'}
                                        disabled={
                                            this.state.runningState === 'running' ||
                                            this.state.programSequence.getProgramLength() === 0}
                                        onClick={this.handleClickPlay}
                                    />
                                </div>
                                <ProgramSpeedController
                                    values={this.speedLookUp}
                                    onChange={this.handleChangeProgramSpeed}
                                />
                            </div>
                            <div className='App__shareButton-container'>
                                <ShareButton/>
                            </div>
                        </div>
                    </Container>
                </div>

                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
            </IntlProvider>
        );
    }

    componentDidMount() {
        if (window.location.search != null) {
            const params = new C2lcURLParams(window.location.search);
            const programQuery = params.getProgram();
            const characterStateQuery = params.getCharacterState();
            if (programQuery != null && characterStateQuery != null) {
                try {
                    this.setState({
                        programSequence: new ProgramSequence(this.programSerializer.deserialize(programQuery), 0, 'stopped'),
                        characterState: this.characterStateSerializer.deserialize(characterStateQuery)
                    });
                } catch(err) {
                    console.log(`Error parsing program: ${programQuery} or characterState: ${characterStateQuery}`);
                    console.log(err.toString());
                }
            }
        }
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        console.log(this.state.programSequence.getProgram());
        console.log(this.state.programSequence.getProgramCounter());
        if (this.state.programSequence !== prevState.programSequence
            || this.state.characterState !== prevState.characterState) {
            const serializedProgram = this.programSerializer.serialize(this.state.programSequence.getProgram());
            const serializedCharacterState = this.characterStateSerializer.serialize(this.state.characterState);
            window.history.pushState(
                {
                    p: serializedProgram,
                    c: serializedCharacterState
                },
                '',
                Utils.generateEncodedProgramURL('0.5', serializedProgram, serializedCharacterState));
        }
        if (this.state.audioEnabled !== prevState.audioEnabled) {
            this.audioManager.setAudioEnabled(this.state.audioEnabled);
        }
        if (this.state.programSequence !== prevState.programSequence) {
            this.interpreter.setProgramSequence(this.state.programSequence);
        }
        if (this.state.runningState !== prevState.runningState) {
            this.interpreter.setRunningState(this.state.runningState);
            if (this.state.runningState === 'running') {
                this.interpreter.run();
            }
        }
        /* Dash connection removed for version 0.5
        if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
            console.log(this.state.dashConnectionStatus);

            if (this.state.dashConnectionStatus === 'connected') {
                this.interpreter.addCommandHandler('forward', 'dash',
                    this.dashDriver.forward.bind(this.dashDriver));
                this.interpreter.addCommandHandler('left', 'dash',
                    this.dashDriver.left.bind(this.dashDriver));
                this.interpreter.addCommandHandler('right', 'dash',
                    this.dashDriver.right.bind(this.dashDriver));
            } else if (this.state.dashConnectionStatus === 'notConnected') {
                // TODO: Remove Dash handlers

                if (this.state.runningState === 'running) {
                    this.interpreter.stop();
                }
            }
        }
        */
    }
}
