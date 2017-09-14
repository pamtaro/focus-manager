import { focusableTypes, focusingStates } from './types';
import { buildDefaultCurrentFocusTree, buildTree, filterFocusableProperties, getChildNode, normalizeTree,
    updateCurrentFocusByHistoryAndDirection, updateFocusItemsFocusedStatus } from './helpers';

export class FocusManager {
    constructor (keyHelpers, transitionDuration) {
        this.keyHelpers = keyHelpers;
        this.transitionDuration = transitionDuration;
    }

    getCurrentFocus() {
        return this.currentFocus;
    }

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
        const normalizedFocusTree = normalizeTree(focusable);
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
    
    isAnyDirectionalKey = (keyCode) => this.keyHelpers.isAnyDirectionalKey(keyCode);
    isUpKey = (keyCode) => this.keyHelpers.isUpKey(keyCode);
    isDownKey = (keyCode) => this.keyHelpers.isDownKey(keyCode);
    isLeftKey = (keyCode) => this.keyHelpers.isLeftKey(keyCode);
    isRightKey = (keyCode) => this.keyHelpers.isRightKey(keyCode);
    isSelectKey = (keyCode) => this.keyHelpers.isSelectKey(keyCode);

    registerFocusable(focusable, focusHistory = this.focusHistory) {
        const normalizedFocusTree = normalizeTree(focusable);
        if (normalizedFocusTree.type !== focusableTypes.ROOT) {
            throw 'normalizedFocusTree must start with a ROOT';
        }

        this.focusHistory = buildTree(focusHistory, normalizedFocusTree);
    }

    setCurrentFocusFromComponent(focusedItem) {        
        if (focusedItem.type !== focusableTypes.ITEM) {
            throw 'focusedItem item must be an an ITEM type';
        }
        this.currentFocus = normalizeTree(focusedItem);
        return this.currentFocus;
    }

    updateCurrentFocusByDirection(focusDirection) {
        if (!this.currentFocus && this.focusHistory) {
            // if currentFocus has not been prevously set, return the first Focus ITEM for the last ROOT in the focusHistory
            this.currentFocus = buildDefaultCurrentFocusTree(this.focusHistory[this.focusHistory.length-1]); 
        } else {
            const result = updateCurrentFocusByHistoryAndDirection(this.focusHistory, this.currentFocus, focusDirection);
            this.currentFocus = result.focusedChildNode;
        }
        return this.currentFocus;        
    }

    updateFocusHistoryFocusItemStates(currentFocusItem = this.currentFocusItem, focusHistory = this.focusHistory) {
        if (currentFocusItem.type !== focusableTypes.ROOT) {
            throw 'currentFocusItem must start with a ROOT';
        }
        const focusRootTree = focusHistory.find(node => node.index === currentFocusItem.index
            && node.path === currentFocusItem.path);
        if (focusRootTree) {
            // starting with the root's immediate children, update all children focusItems
            updateFocusItemsFocusedStatus(focusRootTree.focusableChildren, currentFocusItem.focusableChildren);
        } else {
            // root of tree not found, return null
            return null;
        }

        this.focusHistory = focusHistory;
        return focusHistory;
    }
}