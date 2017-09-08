import { actionTypes } from './types';

export function registerFocusable(focusable) {
    return {
        type: actionTypes.FOCUS.REGISTER_FOCUSABLE,
        focusable: JSON.parse(JSON.stringify(focusable))
    };
}
