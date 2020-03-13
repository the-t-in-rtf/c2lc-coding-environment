// @flow

let idCounter: number = 0;

function generateId(prefix: string): string {
    const id = `${prefix}-${idCounter}`;
    idCounter += 1;
    return id;
}

function setFocusTrap(
    e: SyntheticKeyboardEvent<HTMLInputElement>,
    trapCondition: boolean,
    trapStateHandler: (active: boolean) => void,
    parentContainerClassName: string,
    childrenSelector: string,
    interactingElementClassName: string): void {
    const tabKeyCode = 9;
    const escKeyCode = 27;
    const parentContainer = document.querySelector(parentContainerClassName);
    if (trapCondition && parentContainer) {
        const childComponents = parentContainer.querySelectorAll(childrenSelector);
        const interactingElement = document.querySelector(interactingElementClassName);
        if (childComponents && interactingElement) {
            const numberOfChildComponents = childComponents.length;
            if (e.keyCode === tabKeyCode) {
                if (e.shiftKey && document.activeElement === interactingElement) {
                    e.preventDefault();
                    childComponents[numberOfChildComponents-1].focus();
                } else if (e.shiftKey && document.activeElement === childComponents[0]) {
                    e.preventDefault();
                    interactingElement.focus();
                } else if (!e.shiftKey && document.activeElement === interactingElement) {
                    e.preventDefault();
                    childComponents[0].focus();
                } else if (!e.shiftKey && document.activeElement === childComponents[numberOfChildComponents-1]) {
                    e.preventDefault();
                    interactingElement.focus();
                }
            } else if (e.keyCode === escKeyCode) {
                trapStateHandler(false);
                interactingElement.focus();
            }
        }
    }
}

export { generateId, setFocusTrap };
