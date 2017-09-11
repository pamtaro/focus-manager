import { focusableTypes, focusingStates } from './types';
import { normalizeHierarchy, buildTree, getChildNode, updateFocusItemStatus } from './helpers';

export class FocusManager {
    constructor (keyHelpers, transitionDuration) {
        this.keyHelpers = keyHelpers;
        this.transitionDuration = transitionDuration;
    }

    isAnyDirectionalKey = (keyCode) => this.keyHelpers.isAnyDirectionalKey(keyCode);
    isUpKey = (keyCode) => this.keyHelpers.isUpKey(keyCode);
    isDownKey = (keyCode) => this.keyHelpers.isDownKey(keyCode);
    isLeftKey = (keyCode) => this.keyHelpers.isLeftKey(keyCode);
    isRightKey = (keyCode) => this.keyHelpers.isRightKey(keyCode);
    isSelectKey = (keyCode) => this.keyHelpers.isSelectKey(keyCode);

    getFocusDirectionalStatus(keyCode) {
        if (this.isUpKey(keyCode)) {
            return focusingStates.UP;
        } else if (this.isDownKey(keyCode)) {
            return focusingStates.DOWN;
        } else if (this.isLeftKey(keyCode)) {
            return focusingStates.LEFT;
        } else if (this.isRightKey(keyCode)) {
            return focusingStates.RIGHT;
        } else {
            return null;
        }
    }

    getFocusItem(focusable, focusHistory = this.focusHistory) {
        const normalizedFocusTree = normalizeHierarchy(focusable);
        if (normalizedFocusTree.type !== focusableTypes.ROOT) {
            throw 'normalizedFocusTree must start with a ROOT';
        }
        return getChildNode(focusHistory, normalizedFocusTree);
    }

    getFocusHistory() {
        return this.focusHistory;
    }

    getTransitionDuration() {
        return this.transitionDuration;
    }

    registerFocusable(focusable, focusHistory = this.focusHistory) {
        const normalizedFocusTree = normalizeHierarchy(focusable);
        if (normalizedFocusTree.type !== focusableTypes.ROOT) {
            throw 'normalizedFocusTree must start with a ROOT';
        }

        this.focusHistory = buildTree(focusHistory, normalizedFocusTree);
    }

    setFocusStatusHistory(focusable, focusHistory = this.focusHistory) {
        if (focusable.type !== focusableTypes.ITEM) {
            throw 'focusable item must be an an ITEM type';
        }

        const normalizedFocusTree = normalizeHierarchy(focusable);
        if (normalizedFocusTree.type !== focusableTypes.ROOT) {
            throw 'normalizedFocusTree must start with a ROOT';
        }
        const focusRootTree = focusHistory.find(node => node.index === normalizedFocusTree.index
            && node.path === normalizedFocusTree.path);
        if (focusRootTree) {
            // starting with the root's immediate children, update all children focusItems
            updateFocusItemStatus(focusRootTree.focusableChildren, normalizedFocusTree.focusableChildren);
        } else {
            // root of tree not found, return null
            return null;
        }
        return focusHistory;
    }
}