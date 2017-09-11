import { actionTypes, focusingStates } from './types';
import { normalizeHierarchy } from './helpers';

export function updateFocusHistory(focusManager) {    
    const focusHistory = focusManager.getFocusHistory();
    return {
        type: actionTypes.FOCUS.UPDATE_HISTORY,
        focusHistory
    };
}

export function updateFocusedItem(focusManager, focusedItem) {
    // filter/normalize the focusable item
    const filterFocusable = normalizeHierarchy(focusedItem);
    const focusHistory = focusManager.setFocusStatusHistory(focusedItem);
    return {
        type: actionTypes.FOCUS.SET_FOCUSED_ITEM,
        focusHistory
    };
}

export function setFocusedItem(focusManager, focusedItem) {
    return (dispatch) => {
        dispatch(updateFocusedItem(focusManager, focusedItem));
        dispatch(focusingHandled());
    };
}

export function updateFocusingStatus(focusingStatus) {
    return {
        type: actionTypes.FOCUS.UPDATE_FOCUSING_STATUS,
        focusingStatus,
    };
}

export function rootMounted() {
    return updateFocusingStatus(focusingStates.ROOT_MOUNTED);
}

export function focusingHandled() {
    return updateFocusingStatus(focusingStates.HANDLED);
}
