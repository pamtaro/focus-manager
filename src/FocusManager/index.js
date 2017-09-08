import { focusableTypes } from './types';
import { normalizeHierarchy, recursivelyUpdateTree } from './helpers';

export class FocusManager {
    registerFocusable(focusHistory, focusable) {
        const normalizedFocusTree = normalizeHierarchy(focusable);
        if (normalizedFocusTree.type !== focusableTypes.ROOT) {
            throw 'normalizedFocusTree must start with a ROOT';
        }

        this.focusHistory = recursivelyUpdateTree(focusHistory, normalizedFocusTree);
    }

    getFocusHistory() {
        return this.focusHistory;
    }
}