import { actionTypes, focusableTypes } from './types';

const defaultState = {
    focusHistory: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.FOCUS.UPDATE_HISTORY: {
            const { focusHistory } = action;
            return { ...state, focusHistory };
        }

        default:
            return state;

    };
}
