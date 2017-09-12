import { actionTypes, focusingStates } from './types';
import { normalizeTree } from './helpers';

export function updateFocusHistory(focusManager) {    
    const focusHistory = focusManager.getFocusHistory();
    return {
        type: actionTypes.FOCUS.UPDATE_HISTORY,
        focusHistory
    };
}

export function setFocusedItemFromComponent(focusManager, focusedItem) {
    const currentFocus = focusManager.setCurrentFocusFromComponent(focusedItem);
    const focusHistory = focusManager.updateFocusHistoryFocusItemStates(currentFocus);
    return setFocusedItem(currentFocus, focusHistory);
}

export function moveFocus(focusManager, directionStatus) {
    return (dispatch) => {        
        const currentFocus = focusManager.updateCurrentFocusByDirection(directionStatus)
        const focusHistory = focusManager.updateFocusHistoryFocusItemStates(currentFocus);
        dispatch(setFocusedItem(currentFocus, focusHistory));
        
        dispatch(updateFocusingStatus(directionStatus));
    }
}

export function rootMounted() {
    return updateFocusingStatus(focusingStates.ROOT_MOUNTED);
}

export function focusingHandled() {
    return updateFocusingStatus(focusingStates.HANDLED);
}

function setFocusedItem(currentFocus, focusHistory) {
    return {
        type: actionTypes.FOCUS.SET_FOCUSED_ITEM,
        currentFocus,
        focusHistory
    };
}

function updateFocusingStatus(focusingStatus) {
    return {
        type: actionTypes.FOCUS.UPDATE_FOCUSING_STATUS,
        focusingStatus,
    };
}