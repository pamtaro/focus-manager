import { focusableTypes, focusItemStates } from './types';

// This method is called recursively to update the a tree from the top level down to the focusableChildren nodes
// In practice, this starts with the ROOT node of the focusHistory array and drills down into GRIDs and ITEMs,
// adding any missing child objects in the source tree 
export function buildTree(sourceTreeArray, updateTree) {
    const existingTreeNode = sourceTreeArray.find(node => node.index === updateTree.index 
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

// This method gets called recursively to return the inner-most child node
export function getChildNode(sourceTreeArray, searchTree) {
    const existingTreeNode = sourceTreeArray.find(node => node.index === searchTree.index 
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

// This method gets called recursively to return the inner-most child node
export function updateFocusItems(sourceTreeArray, searchTree) {
    const existingTreeNode = sourceTreeArray.find(node => node.index === searchTree.index 
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
export function normalizeHierarchy(focusable) {
    // create a filtered copy of the focusable
    const focusableCopy = filterFocusableProperties(focusable); // JSON.parse(JSON.stringify(focusable));
    if (focusableCopy.focusableParent) {
        const normalizedFocusable = normalizeHierarchy(focusableCopy.focusableParent);
        delete focusableCopy['focusableParent'];

        appendChild(normalizedFocusable, focusableCopy);
        return normalizedFocusable;
    } else {
        return focusableCopy;
    }
}  

// Update all children FocusItems to set their status
export function updateFocusItemStatus(children, focusChildTree) {
    children.forEach((child, index) => {        
        const focusChildNode = focusChildTree && focusChildTree.find(f => f.index === child.index && f.type === child.type);
        if (child.type === focusableTypes.ITEM) {
            if (!focusChildTree) {
                // this child item was not part of the same tree as the intended focus child
                // check if this node's status was previously set to FOCUSED, if so change it to ACTIVE, otherwise mark as DEFAULT
                child.focusedStatus = child.focusedStatus === focusItemStates.FOCUSED ? focusItemStates.ACTIVE : focusItemStates.DEFAULT;
            } else {
                // if this child item is in the same row as the intended focus child,
                // then mark the focus child node as FOCUSED, but other child items as DEFAULT
                child.focusedStatus = focusChildNode ? focusItemStates.FOCUSED : focusItemStates.DEFAULT;
            }
        } else if (child.focusableChildren) {
            updateFocusItemStatus(child.focusableChildren, focusChildNode && focusChildNode.focusableChildren ? focusChildNode.focusableChildren : null);
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

// This method filters properties from the focusable object so we only have properties relevant for the focus history
function filterFocusableProperties(focusable) {
    const whiteListedProps = ['type', 'index', 'path', 'focusableParent', 'focusableChildren', 'rootGridDirection', 'focusedStatus'];
    const newFocusable = whiteListedProps.reduce((newObj, wlProp) => {
        if (focusable.hasOwnProperty(wlProp)) {
            newObj[wlProp] = focusable[wlProp];
        }
        return newObj;
    }, {});
    return newFocusable;
}