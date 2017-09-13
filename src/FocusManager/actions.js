import { actionTypes, focusingStates } from './types';

export function setCurrentFocusRoot(id, focusManager) {
    const focusHistory = focusManager.setCurrentFocusRoot(id);
    return {
        type: actionTypes.FOCUS.SET_CURRENT_FOCUS_ROOT,
        id
    }
}

export function updateFocusHistory(focusManager) {    
    const focusHistory = focusManager.getFocusHistory();
    return {
        type: actionTypes.FOCUS.UPDATE_HISTORY,
        focusHistory
    };
}

export function setFocusedItemFromComponent(focusManager, focusedItem) {
    const currentFocusItem = focusManager.setCurrentFocusItem(focusedItem);
    const focusHistory = focusManager.getFocusHistory();
    return setFocusedItem(currentFocusItem, focusHistory);
}

export function moveFocus(focusManager, directionStatus) {
    return (dispatch) => {        
        const currentFocusItem = focusManager.updateCurrentFocusItemByDirection(directionStatus)
        const focusHistory = focusManager.getFocusHistory();
        dispatch(setFocusedItem(currentFocusItem, focusHistory));
        
        dispatch(updateFocusingStatus(directionStatus));
    }
}

export function rootMounted() {
    return updateFocusingStatus(focusingStates.ROOT_MOUNTED);
}

export function focusingHandled() {
    return updateFocusingStatus(focusingStates.HANDLED);
}

function setFocusedItem(currentFocusItem, focusHistory) {
    return {
        type: actionTypes.FOCUS.SET_FOCUSED_ITEM,
        currentFocusItem,
        focusHistory
    };
}

function updateFocusingStatus(focusingStatus) {
    return {
        type: actionTypes.FOCUS.UPDATE_FOCUSING_STATUS,
        focusingStatus,
    };
}