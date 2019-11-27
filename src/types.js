// @flow

export type DeviceConnectionStatus = 'notConnected' | 'connecting' | 'connected';

export type EditorMode = 'text' | 'block';

export type Program = Array<string>;

export type SelectedAction =
    null
    |
    {
        type: 'command',
        commandName: string
    }
    |
    {
        type: 'editorAction',
        action: 'add' | 'delete'
    }
;
