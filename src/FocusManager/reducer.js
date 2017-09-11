import { actionTypes, focusableTypes } from './types';

const defaultState = {
    focusHistory: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
        
        case actionTypes.FOCUS.SET_FOCUSED_ITEM:
        case actionTypes.FOCUS.UPDATE_HISTORY: {
            const { focusHistory } = action;
            return { ...state, focusHistory };
        }

        case actionTypes.FOCUS.UPDATE_FOCUSING_STATUS: {
            const { focusingStatus } = action;
            return { ...state, focusingStatus }
        }

        default:
            return state;

    };
}
