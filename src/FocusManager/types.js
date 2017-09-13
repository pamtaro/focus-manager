
export const actionTypes = {
    FOCUS: {
        UPDATE_HISTORY: 'FOCUS.UPDATE_HISTORY',
        SET_CURRENT_FOCUS_ROOT: 'FOCUS.SET_CURRENT_FOCUS_ROOT',
        SET_FOCUSED_ITEM: 'FOCUS.SET_FOCUSED_ITEM',
        UPDATE_FOCUSING_STATUS: 'FOCUS.UPDATE_FOCUSING_STATUS',
    },
};

export const focusableTypes = {
    ROOT: 'ROOT',
    GRID: {
        HORIZONTAL: 'GRID.HORIZONTAL',
        VERTICAL: 'GRID.VERTICAL',
    },
    ITEM: 'ITEM',
};

export const focusableStates = {
    DEFAULT: 'DEFAULT', // DEFAULT is not focused AND not active
    ACTIVE: 'ACTIVE', // ACTIVE is when the item IS NOT currently focused, BUT will be if focus returns to it's parent GRID
    FOCUSED: 'FOCUSED', // FOCUSED is when the item is currently focused
};

export const focusingStates = {
    ROOT_MOUNTED: 'ROOT_MOUNTED',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
    HANDLED: 'HANDLED',
};
