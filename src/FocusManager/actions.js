import { actionTypes, focusingStates } from './types';

export function focusingHandled() {
    return updateFocusingStatus(focusingStates.HANDLED);
}

export function moveFocus(focusManager, directionStatus) {
    return (dispatch) => {        
        const currentFocusItemId = focusManager.updateCurrentFocusItemByDirection(directionStatus)
        const focusHistory = focusManager.getFocusHistory();
        dispatch(setFocusedItem(currentFocusItemId, focusHistory));
        
        dispatch(updateFocusingStatus(directionStatus));
    }
}

export function rootMounted() {
    return updateFocusingStatus(focusingStates.ROOT_MOUNTED);
}

export function setCurrentFocusRootId(id, focusManager) {
    focusManager.setCurrentFocusRootId(id);
    return {
        type: actionTypes.FOCUS.SET_CURRENT_FOCUS_ROOT,
        id
    }
}

function setFocusedItem(currentFocusItemId, focusHistory) {
    return {
        type: actionTypes.FOCUS.SET_FOCUSED_ITEM,
        currentFocusItemId,
        focusHistory
    };
}

export function setFocusedItemFromComponent(focusManager, focusedItem) {
    const currentFocusItemId = focusManager.setCurrentFocusItem(focusedItem);
    const focusHistory = focusManager.getFocusHistory();
    return setFocusedItem(currentFocusItemId, focusHistory);
}

export function updateFocusHistory(focusManager) {    
    const focusHistory = focusManager.getFocusHistory();
    return {
        type: actionTypes.FOCUS.UPDATE_HISTORY,
        focusHistory
    };
}

function updateFocusingStatus(focusingStatus) {
    return {
        type: actionTypes.FOCUS.UPDATE_FOCUSING_STATUS,
        focusingStatus,
    };
}