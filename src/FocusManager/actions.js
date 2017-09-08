import { actionTypes } from './types';

export function updateFocusHistory(focusHistory) {
    return {
        type: actionTypes.FOCUS.UPDATE_HISTORY,
        focusHistory
    };
}
