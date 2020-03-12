// @flow

let idCounter: number = 0;

function generateId(prefix: string): string {
    const id = `${prefix}-${idCounter}`;
    idCounter += 1;
    return id;
}

// make ids of interacting element, first focus item, and last focus item as parameter
function setFocusTrap(e: SyntheticKeyboardEvent<HTMLInputElement>, replaceIsActive: boolean, setReplaceIsActive: (active: boolean) => null): void {
    const tabKeyCode = 9;
    const escKeyCode = 27;
    if (replaceIsActive) {
        const firstCommandButton = document.getElementById('command-block--forward');
        const lastCommandButton = document.getElementById('command-block--left');
        const replaceButton = document.getElementById('replaceAction');
        if (firstCommandButton && lastCommandButton && replaceButton) {
            if (e.keyCode === tabKeyCode) {
                if (e.shiftKey && document.activeElement === replaceButton) {
                    e.preventDefault();
                    lastCommandButton.focus();
                } else if (e.shiftKey && document.activeElement === firstCommandButton) {
                    e.preventDefault();
                    replaceButton.focus();
                } else if (!e.shiftKey && document.activeElement === replaceButton) {
                    e.preventDefault();
                    firstCommandButton.focus();
                } else if (!e.shiftKey && document.activeElement === lastCommandButton) {
                    e.preventDefault();
                    replaceButton.focus();
                }
            } else if (e.keyCode === escKeyCode) {
                setReplaceIsActive(false);
                replaceButton.focus();
            }
        }
    }
}

export { generateId, setFocusTrap };
