export const KeyCodes = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    A: 65,
    E: 69,
    Y: 89,
    EQUALS: 187,
    GAMEPAD_A: 195,
    GAMEPAD_B: 196,
    GAMEPAD_X: 197,
    GAMEPAD_Y: 198,
    GAMEPAD_RIGHT_SHOULDER: 199,
    GAMEPAD_LEFT_SHOULDER: 200,
    GAMEPAD_LEFT_TRIGGER: 201,
    GAMEPAD_RIGHT_TRIGGER: 202,
    GAMEPAD_D_PAD_UP: 203,
    GAMEPAD_D_PAD_DOWN: 204,
    GAMEPAD_D_PAD_LEFT: 205,
    GAMEPAD_D_PAD_RIGHT: 206,
    GAMEPAD_MENU: 207,
    GAMEPAD_VIEW: 208,
    GAMEPAD_LEFT_THUMBSTICK: 209,
    GAMEPAD_RIGHT_THUMBSTICK: 210,
    GAMEPAD_LEFT_THUMBSTICK_UP: 211,
    GAMEPAD_LEFT_THUMBSTICK_DOWN: 212,
    GAMEPAD_LEFT_THUMBSTICK_RIGHT: 213,
    GAMEPAD_LEFT_THUMBSTICK_LEFT: 214,
    GAMEPAD_RIGHT_THUMBSTICK_UP: 215,
    GAMEPAD_RIGHT_THUMBSTICK_DOWN: 216,
    GAMEPAD_RIGHT_THUMBSTICK_RIGHT: 217,
    GAMEPAD_RIGHT_THUMBSTICK_LEFT: 218,
    HYPHEN: 189,
};


/**
 * Key helpers to determine direction of key down actions on keyboards, gamepads, and remotes
 * @param {*} keyCode
 */

export const isSelectKey = (keyCode) => {
    switch (keyCode) {
        case KeyCodes.ENTER:
        case KeyCodes.SPACE:
        case KeyCodes.A:
        case KeyCodes.GAMEPAD_A:
        case KeyCodes.GAMEPAD_LEFT_THUMBSTICK:
        case KeyCodes.GAMEPAD_RIGHT_THUMBSTICK:
            return true;
        default:
            return false;
    }
};

export const isLeftKey = (keyCode) => {
    switch (keyCode) {
        case KeyCodes.ARROW_LEFT:
        case KeyCodes.GAMEPAD_D_PAD_LEFT:
        case KeyCodes.GAMEPAD_LEFT_THUMBSTICK_LEFT:
            return true;
        default:
            return false;
    }
};

export const isRightKey = (keyCode) => {
    switch (keyCode) {
        case KeyCodes.ARROW_RIGHT:
        case KeyCodes.GAMEPAD_D_PAD_RIGHT:
        case KeyCodes.GAMEPAD_LEFT_THUMBSTICK_RIGHT:
            return true;
        default:
            return false;
    }
};

export const isUpKey = (keyCode) => {
    switch (keyCode) {
        case KeyCodes.ARROW_UP:
        case KeyCodes.GAMEPAD_D_PAD_UP:
        case KeyCodes.GAMEPAD_LEFT_THUMBSTICK_UP:
            return true;
        default:
            return false;
    }
};

export const isDownKey = (keyCode) => {
    switch (keyCode) {
        case KeyCodes.ARROW_DOWN:
        case KeyCodes.GAMEPAD_D_PAD_DOWN:
        case KeyCodes.GAMEPAD_LEFT_THUMBSTICK_DOWN:
            return true;
        default:
            return false;
    }
};

export const isAnyDirectionalKey = (keyCode) => isLeftKey(keyCode) || isRightKey(keyCode) || isUpKey(keyCode) || isDownKey(keyCode);

export const isSearchKey = (keyCode) => {
    switch (keyCode) {
        case KeyCodes.GAMEPAD_Y:
        // case KeyCodes.Y: // TODO: comment out Y keyboard for quick testing in browser
            return true;
        default:
            return false;
    }
};

export const isShoulderButton = (keyCode) => {
    switch (keyCode) {
        case KeyCodes.GAMEPAD_LEFT_SHOULDER:
        case KeyCodes.GAMEPAD_RIGHT_SHOULDER:
            return true;
        default:
            return false;
    }
};
