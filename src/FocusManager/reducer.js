import { actionTypes } from './types';

const defaultState = {
    focusHistory: {}
};

export default (state = defaultState, action) => {
    switch (action.type) {

        case actionTypes.FOCUS.SET_CURRENT_FOCUS_ROOT:
            return {
                ...state,
                currentFocusRootId: action.id,
            };
        
        case actionTypes.FOCUS.SET_FOCUSED_ITEM: {
            const { currentFocusItemId, focusHistory } = action;
            return {
                ...state,
                currentFocusItemId,
                focusHistory,
            };
        }
        
        case actionTypes.FOCUS.UPDATE_FOCUSING_STATUS: {
            const { focusingStatus } = action;
            return { ...state, focusingStatus };
        }

        case actionTypes.FOCUS.UPDATE_HISTORY: {
            const { focusHistory } = action;
            return { ...state, focusHistory };
        }

        default:
            return state;

    };
}
