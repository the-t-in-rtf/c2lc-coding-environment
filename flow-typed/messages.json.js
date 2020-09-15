// @flow
declare module "./messages.json" {
    // TODO: Update to use a regexp once https://github.com/facebook/flow/issues/4654 is resolved.
    declare type MessageKey = string;

    declare type SingleLanguageBundle = {
        [MessageKey]: string
    };

    // TODO: Figure out a better way to handle this, this is the only way I can keep it from complaining about using messages.en in another file.
    declare type MessageBundle = {
        en : SingleLanguageBundle,
        fr: SingleLanguageBundle
    };

    declare module.exports : MessageBundle;
}
