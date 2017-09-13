import { focusableTypes, focusingStates, focusItemStates  } from './types';

// This method automatically returns the first child nodes available in the tree to construct the default focus
export function buildDefaultCurrentFocusTree(currentNode) {
    const filteredNode = filterFocusableProperties(currentNode);
    if (filteredNode.focusableChildren && filteredNode.focusableChildren.length > 0) {     
        const firstChild = buildDefaultCurrentFocusTree(filteredNode.focusableChildren[0]);   
        filteredNode.focusableChildren = [ firstChild ];
        return filteredNode;
    }
    return filteredNode;
}

// This method is called recursively to update the a tree from the top level down to the focusableChildren nodes
// In practice, this starts with the ROOT node of the focusHistory array and drills down into GRIDs and ITEMs,
// adding any missing child objects in the source tree 
export function buildTree(sourceTreeArray, updateTree) {
    const existingTreeNode = sourceTreeArray.find(node => node.index === updateTree.index && node.type === updateTree.type
        && (node.type !== focusableTypes.ROOT || node.path === updateTree.path));
    if (existingTreeNode) {
        // traverse the tree's focusableChildren to add any missing focusableChildren
        if (existingTreeNode.focusableChildren && existingTreeNode.focusableChildren.length > 0) {
            existingTreeNode.focusableChildren = buildTree(existingTreeNode.focusableChildren, updateTree.focusableChildren[0])
        } else {
            // focusableChildren for this node do not exist yet, so use this updateTree's focusableChildren
            existingTreeNode.focusableChildren = updateTree.focusableChildren;
        }
        // replace the node in the existing source tree array with the updated tree node
        const existingIndex = sourceTreeArray.findIndex(node => node.index === updateTree.index);
        sourceTreeArray.splice(existingIndex, 1, existingTreeNode);
    } else {
        // if the node is not found for the given index (path+index for ROOT), push this updateTree object onto the history array
        sourceTreeArray.push(updateTree);
    }
    return sourceTreeArray;
}

// This method filters properties from the focusable object so we only have properties relevant for the focus history
export function filterFocusableProperties(focusable) {
    const whiteListedProps = ['type', 'index', 'path', 'focusableParent', 'focusableChildren', 'rootGridDirection', 'focusedStatus'];
    const newFocusable = whiteListedProps.reduce((newObj, wlProp) => {
        if (focusable.hasOwnProperty(wlProp)) {
            newObj[wlProp] = focusable[wlProp];
        }
        return newObj;
    }, {});
    return newFocusable;
}

// This method gets called recursively to return the bottom-most child node
export function getChildNode(sourceTreeArray, searchTree) {
    const existingTreeNode = sourceTreeArray.find(node => node.index === searchTree.index && node.type === searchTree.type
        && (node.type !== focusableTypes.ROOT || node.path === searchTree.path));
    if (existingTreeNode) {
        // traverse the tree's focusableChildren
        if (existingTreeNode.focusableChildren && existingTreeNode.focusableChildren.length > 0) {
            return getChildNode(existingTreeNode.focusableChildren, searchTree.focusableChildren[0])
        } else {
            // tree node has no children, so this is the node we want
            return existingTreeNode;
        }
    } else {
        // node not found, return null
        return null;
    }
}

// This method reverses the incoming hierarchy received from a focusable component that contains a reference to it's parent.
// In order to be stored more efficiently in the focusHistory, the hierachy tree need to start at the root and contain focusableChildren.
export function normalizeTree(focusable) {
    // create a filtered copy of the focusable
    const focusableCopy = filterFocusableProperties(focusable);
    if (focusableCopy.focusableParent) {
        const normalizedFocusable = normalizeTree(focusableCopy.focusableParent);
        delete focusableCopy['focusableParent'];

        appendChild(normalizedFocusable, focusableCopy);
        return normalizedFocusable;
    } else {
        return focusableCopy;
    }
}  

// This method traverses the source array and focus tree node (starting with the focusHistory and the currentFocus)
// it calls recursively until it reaches the bottom of the tree (the focus item), then will set a flag to indicate that as the method
// returns and walks back up the tree, it should use the current parent/child node to calculate the next item to set as the focused item
export function updateCurrentFocusByHistoryAndDirection(sourceTreeArray, focusedTreeNode, focusDirection) {
    let nextParentShouldUpdate = false;
    const existingTreeNode = sourceTreeArray.find(node => node.index === focusedTreeNode.index && node.type === focusedTreeNode.type
        && (node.type !== focusableTypes.ROOT || node.path === focusedTreeNode.path));
    if (existingTreeNode) {
        if (existingTreeNode.focusableChildren && existingTreeNode.focusableChildren.length > 0) {
            // if parentShouldUpdate returned true, this existing node is the level to control next focus based on the direction
            const { focusedChildNode, parentShouldUpdate } = updateCurrentFocusByHistoryAndDirection(existingTreeNode.focusableChildren, focusedTreeNode.focusableChildren[0], focusDirection);
            if (parentShouldUpdate) {
                const nextChildIndex = calculateNextIndex(focusedChildNode.index, focusDirection); 
                const isNextIndexOutOfBounds = nextChildIndex < 0 || nextChildIndex >= existingTreeNode.focusableChildren.length;
                const isFocusDirectionVertical = focusDirection === focusingStates.DOWN || focusDirection === focusingStates.UP;
                const isNodeVertical = existingTreeNode.type === focusableTypes.GRID.VERTICAL || existingTreeNode.rootGridDirection === focusableTypes.GRID.VERTICAL;                            
                if (isFocusDirectionVertical !== isNodeVertical || isNextIndexOutOfBounds) {
                    // operation at this level isn't valid because it's either a vertical grid trying to move in a horizontal direction or vice-versa
                    // OR the resulting move would make the index out of bounds, so pass along operation to next parent level
                    nextParentShouldUpdate = true;
                } else {
                    // the next index move is valid, so update the focusedTreeNode
                    focusedChildNode.index = nextChildIndex;
                }
            } 
        } else {
            // at bottom of tree, trigger parent should update
            nextParentShouldUpdate = true;
        }
    } else {
        // node not found
        throw 'focusedTreeNode not found in sourceTreeArray';
    }
    
    return {
        focusedChildNode: focusedTreeNode,
        parentShouldUpdate: nextParentShouldUpdate,
    }
}

// Update all children FocusItems to set their status
export function updateFocusItemsFocusedStatus(children, focusedItemTree) {
    children.forEach((child, index) => {        
        const focusChildNode = focusedItemTree && focusedItemTree.find(f => f.index === child.index && f.type === child.type);
        if (child.type === focusableTypes.ITEM) {
            if (!focusedItemTree) {
                // this child item was not part of the same tree as the intended focus child
                // check if this node's status was previously set to FOCUSED, if so change it to ACTIVE, otherwise mark as DEFAULT
                child.focusedStatus = child.focusedStatus === focusItemStates.FOCUSED ? focusItemStates.ACTIVE : focusItemStates.DEFAULT;
            } else {
                // if this child item is in the same row as the intended focus child,
                // then mark the focus child node as FOCUSED, but other child items as DEFAULT
                child.focusedStatus = focusChildNode ? focusItemStates.FOCUSED : focusItemStates.DEFAULT;
            }
        } else if (child.focusableChildren) {
            updateFocusItemsFocusedStatus(child.focusableChildren, focusChildNode && focusChildNode.focusableChildren ? focusChildNode.focusableChildren : null);
        }
    });
}


// This method sets the single child as the sole element in the focusableChildren array of the parent
// we keep the child as an array of focusableChildren to match the formatting expected from the history tree
function appendChild(parent, child) {
    if (Object.keys(parent).includes('focusableChildren')) {
        return appendChild(parent.focusableChildren[0], child);
    } else {
        parent.focusableChildren = [child];
        return parent;
    }
}

// This function determines the next index for the current index and direction
function calculateNextIndex(currentIndex, direction) {
    // should increment index if the focusing direction is down or right
    const incrementIndex = direction === focusingStates.DOWN || direction === focusingStates.RIGHT; 
    return currentIndex + (incrementIndex ? 1 : -1);
}