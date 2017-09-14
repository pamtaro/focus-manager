import { focusableTypes, focusingStates, focusableStates } from './types';

export class FocusManager {
    constructor (keyHelpers, transitionDuration) {
        this.keyHelpers = keyHelpers;
        this.transitionDuration = transitionDuration;

        this.focusHistory = {};
    }
    
    // This function determines the next index for the current index and direction
    calculateNextIndex(currentIndex, direction) {
        // should increment index if the focusing direction is down or right
        const incrementIndex = direction === focusingStates.DOWN || direction === focusingStates.RIGHT; 
        return currentIndex + (incrementIndex ? 1 : -1);
    }

    getCurrentFocusItemId() {
        return this.currentFocusItemId;
    }

    getCurrentFocusRootId() {
        return this.currentFocusRootId;
    }

    getFocusHistory() {
        return this.focusHistory;
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

    getFocusItemStatus(id, focusHistory = this.focusHistory) {
        const item = focusHistory[id];
        return item ? item.focusedStatus : focusableStates.DEFAULT;
    }
    
    getNextFocusRootId(path, focusHistory = this.focusHistory) {
        const focusRootRegExp = new RegExp(`^${path}#(\\d)+$`)
        const existingRootsCount = Object.keys(focusHistory).filter(key => focusRootRegExp.test(key)).length;
        return `${path}#${existingRootsCount}`;
    }

    getTransitionDuration() {
        return this.transitionDuration;
    }
    
    filterFocusableProperties(focusable) {
        const whiteListedProps = ['id', 'type', 'focusableChildIds', 'focusableParentId', 'focusedStatus', 'rootGridDirection', 'useSiblingActiveChildIndex'];
        const newFocusable = whiteListedProps.reduce((newObj, wlProp) => {
            if (focusable.hasOwnProperty(wlProp)) {
                newObj[wlProp] = focusable[wlProp];
            }
            return newObj;
        }, {});
        if (focusable.focusableParent && (!newFocusable.focusableParentId ||
            newFocusable.focusableParentId !== focusable.focusableParent.id)) {
            newFocusable.focusableParentId = focusable.focusableParent.id;
        }
        return newFocusable;
    }

    isAnyDirectionalKey = (keyCode) => this.keyHelpers.isAnyDirectionalKey(keyCode);
    isUpKey = (keyCode) => this.keyHelpers.isUpKey(keyCode);
    isDownKey = (keyCode) => this.keyHelpers.isDownKey(keyCode);
    isLeftKey = (keyCode) => this.keyHelpers.isLeftKey(keyCode);
    isRightKey = (keyCode) => this.keyHelpers.isRightKey(keyCode);
    isSelectKey = (keyCode) => this.keyHelpers.isSelectKey(keyCode);
    
    registerFocusable(focusable, focusHistory = this.focusHistory) {        
        // create a filtered copy of the focusable
        const normalizedFocusable = this.filterFocusableProperties(focusable);
        if (focusable.focusableParent) {            
            const normalizedParent = this.registerFocusable(focusable.focusableParent); 
            normalizedParent.focusableChildIds = [normalizedFocusable.id];
            this.updateFocusHistory(normalizedParent, focusHistory);            
            return normalizedFocusable;
        } else {
            this.updateFocusHistory(normalizedFocusable, focusHistory);            
            return normalizedFocusable;
        }
    }
    
    setCurrentFocusItem(currentFocusItem) {
        const normalizedItem = this.filterFocusableProperties(currentFocusItem);

        // check if other children for this item's parent have entries in the focusHistory, if so, remove them
        this.focusHistory[normalizedItem.focusableParentId].focusableChildIds.forEach(childId => {
            if (childId !== normalizedItem.id && this.focusHistory[childId]) {
                delete this.focusHistory[childId];
            }
        });

        // update the previous focus item to mark it as ACTIVE or remove it from history
        const prevFocusItem = this.focusHistory[this.currentFocusItemId];
        if (prevFocusItem) {
            if (prevFocusItem.focusableParentId === normalizedItem.focusableParentId) {
                // if the previous focus item was in the same parent as the current, remove it from history
                delete this.focusHistory[prevFocusItem.id];
            } else {
                // otherwise update it as ACTIVE in the history
                this.focusHistory[prevFocusItem.id].focusedStatus = focusableStates.ACTIVE;
            }
        }

        // set the current (normalized) focus item's state as FOCUSED
        normalizedItem.focusedStatus = focusableStates.FOCUSED;

        // update the parents activeChildId reference
        let currentNode = normalizedItem;
        let parentNode;
        while (currentNode && currentNode.focusableParentId && (parentNode = this.focusHistory[currentNode.focusableParentId])) {
            parentNode.activeChildId = currentNode.id;
            currentNode = parentNode;
        }

        // save the new current focus item
        this.focusHistory[normalizedItem.id] = normalizedItem;        
        this.currentFocusItemId = currentFocusItem.id;
    }

    setCurrentFocusRootId(currentFocusRootId) {
        this.currentFocusRootId = currentFocusRootId;
    }

    setFocusHistory(focusHistory) {
        this.focusHistory = focusHistory;
    }

    updateCurrentFocusItemByDirection(focusDirection) {
        if (!this.currentFocusItemId && this.focusHistory && this.currentFocusRootId) {
            // if currentFocus has not been prevously set, return the first Focus ITEM 
            // by getting the first child starting with the the root
            let firstChildId = this.currentFocusRootId;
            let lookupNode;
            let parentNodeId;
            while ((lookupNode = this.focusHistory[firstChildId]) && lookupNode && lookupNode.focusableChildIds) {
                firstChildId = lookupNode.focusableChildIds[0];
                parentNodeId = lookupNode.id;
            }
            const nextFocusNode = {
                id: firstChildId,
                type: focusableTypes.ITEM,
                focusableParentId: parentNodeId,
            };
            this.setCurrentFocusItem(nextFocusNode);
        } else {
            this.updateCurrentFocusItemByHistoryAndDirection(focusDirection);
        }
        return this.currentFocusItemId;        
    }

    updateCurrentFocusItemByHistoryAndDirection(focusDirection, currentId = this.currentFocusItemId, focusHistory = this.focusHistory) { 
        const existingNode = focusHistory[currentId];
        if (existingNode.focusableParentId) {
            const parentNode = focusHistory[existingNode.focusableParentId]
            if (parentNode) {
                const currentChildIndex = parentNode.focusableChildIds.findIndex(childId => childId === currentId);
                const nextChildIndex = this.calculateNextIndex(currentChildIndex, focusDirection); 
                const isNextIndexOutOfBounds = nextChildIndex < 0 || nextChildIndex >= parentNode.focusableChildIds.length;
                const isFocusDirectionVertical = focusDirection === focusingStates.DOWN || focusDirection === focusingStates.UP;
                const isNodeVertical = parentNode.type === focusableTypes.GRID.VERTICAL || parentNode.rootGridDirection === focusableTypes.GRID.VERTICAL;                            
                if (isFocusDirectionVertical !== isNodeVertical || isNextIndexOutOfBounds) {
                    // operation at this level isn't valid because it's either a vertical grid trying to move in a horizontal direction or vice-versa
                    // OR the resulting move would make the index out of bounds, so pass along operation to next parent level
                    this.updateCurrentFocusItemByHistoryAndDirection(focusDirection, parentNode.id)
                } else {
                    // the next index move is valid, so construct the appropriate item object
                    this.updateCurrentFocusItemWithNextIndex(nextChildIndex, parentNode, existingNode);
                }
            }
        }
    }

    updateCurrentFocusItemWithNextIndex(nextChildIndex, parentNode, previousFocusable) {
        let nextFocusableId = parentNode.focusableChildIds[nextChildIndex];     
        let parentNodeId = parentNode.id;
        let done = false;
        let tries = 0;
        const maxTries = 10;
        while(!done || tries >= maxTries) {
            const nextFocusableNode = this.focusHistory[nextFocusableId];
            if (!nextFocusableNode) {
                // if node doesnt exist yet in the history, create it as a new ITEM
                const newFocusNode = {
                    id: nextFocusableId,
                    type: focusableTypes.ITEM,
                    focusableParentId: parentNodeId,
                };
                this.setCurrentFocusItem(newFocusNode);            
                done = true;                
            } else if (nextFocusableNode.type === focusableTypes.ITEM) {
                // if this ITEM is already in the history, then pass this exiting node to set as the current focus
                this.setCurrentFocusItem(nextFocusableNode)
                done = true;
            } else {
                // if this is not an ITEM node, (1) first check to see if the 'useSiblingActiveChildIndex' flag is set, if not set,
                // then (2) use it's 'activeChildId' to lookup the next node; otherwise (3) default to first child id
                if (nextFocusableNode.useSiblingActiveChildIndex && nextFocusableNode.focusableParentId === previousFocusable.focusableParentId) {
                    const siblingActiveChildIndex = previousFocusable.focusableChildIds.findIndex(childId => childId === previousFocusable.activeChildId);
                    const nextNodesMaxChildIndex = nextFocusableNode.focusableChildIds.length - 1;
                    nextFocusableId = nextFocusableNode.focusableChildIds[nextNodesMaxChildIndex > siblingActiveChildIndex ? siblingActiveChildIndex : nextNodesMaxChildIndex];
                } else {
                    nextFocusableId = nextFocusableNode.activeChildId || nextFocusableNode.focusableChildIds[0];
                }
                parentNodeId = nextFocusableNode.id;
                tries++; // increment tries so we don't get stuck in a loop
            }
        }           
    }
    
    updateFocusHistory(focusable, focusHistory = this.focusHistory) {
        let isDefaultFocusItem = focusable.type === focusableTypes.ITEM && focusable.focusedStatus === focusableStates.DEFAULT;
        const existingFocusable = focusHistory[focusable.id];
        if (existingFocusable) {
            if (isDefaultFocusItem) {
                // if the item getting updated is a focus ITEM in a default state, delete it from history
                delete focusHistory[focusable.id];
                return;
            }
            existingFocusable.focusableParentId = focusable.focusableParentId;
            if (existingFocusable.focusableChildIds && focusable.focusableChildIds) {
                const newChildId = focusable.focusableChildIds[0];
                if (!existingFocusable.focusableChildIds.includes(newChildId)) {
                    existingFocusable.focusableChildIds.push(newChildId);
                }
            }
        } else if (!isDefaultFocusItem) {
            // only add non-DEFAULT focus ITEMs to the history
            focusHistory[focusable.id] = focusable;
        }
    }
}