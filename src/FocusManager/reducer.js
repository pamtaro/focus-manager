import { actionTypes, focusableTypes } from './types';

const defaultState = {
    focusHistory: {}
};

export default (state = defaultState, action) => {
    switch (action.type) {

        case actionTypes.FOCUS.SET_CURRENT_FOCUS_ROOT:
            return {
                ...state,
                currentFocusRoot: action.id,
            };
        
        case actionTypes.FOCUS.SET_FOCUSED_ITEM: {
            const { currentFocusItem, focusHistory } = action;
            return {
                ...state,
                currentFocusItem,
                focusHistory,
            };
        }

        case actionTypes.FOCUS.UPDATE_HISTORY: {
            const { focusHistory } = action;
            return { ...state, focusHistory };
        }

        case actionTypes.FOCUS.UPDATE_FOCUSING_STATUS: {
            const { focusingStatus } = action;
            return { ...state, focusingStatus };
        }

        default:
            return state;

    };
}
