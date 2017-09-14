
export const actionTypes = {
    FOCUS: {
        SET_CURRENT_FOCUS_ROOT: 'FOCUS.SET_CURRENT_FOCUS_ROOT',
        SET_FOCUSED_ITEM: 'FOCUS.SET_FOCUSED_ITEM',
        UPDATE_FOCUSING_STATUS: 'FOCUS.UPDATE_FOCUSING_STATUS',
        UPDATE_HISTORY: 'FOCUS.UPDATE_HISTORY',
    },
};

export const focusableTypes = {
    GRID: {
        HORIZONTAL: 'GRID.HORIZONTAL',
        VERTICAL: 'GRID.VERTICAL',
    },
    ITEM: 'ITEM',
    ROOT: 'ROOT',
};

export const focusableStates = {
    ACTIVE: 'ACTIVE', // ACTIVE is when the item IS NOT currently focused, BUT will be if focus returns to it's parent GRID
    DEFAULT: 'DEFAULT', // DEFAULT is not focused AND not active
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
