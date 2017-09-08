import { focusableTypes } from './types';

// This method is called recursively to update the a tree from the top level down to the children nodes
// In practice, this starts with the ROOT node of the focusHistory array and drills down into GRIDs and ITEMs,
// adding any missing child objects in the source tree 
export function recursivelyUpdateTree(sourceTreeArray, updateTree) {
    const existingTreeNode = sourceTreeArray.find(node => node.index === updateTree.index 
        && (node.type !== focusableTypes.ROOT || node.path === updateTree.path));
    if (existingTreeNode) {
        // traverse the tree's children to add any missing children
        if (existingTreeNode.children && existingTreeNode.children.length > 0) {
            existingTreeNode.children = recursivelyUpdateTree(existingTreeNode.children, updateTree.children[0])
        } else {
            // children for this node do not exist yet, so use this updateTree's children
            existingTreeNode.children = updateTree.children;
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

// This method reverses the incoming hierarchy received from a focusable component that contains a reference to it's parent.
// In order to be stored more efficiently in the focusHistory, the hierachy tree need to start at the root and contain children.
export function normalizeHierarchy(focusable) {
    // create a deep copy of the focusable so we don't manipulate the original reference
    const focusableCopy = JSON.parse(JSON.stringify(focusable));
    if (focusableCopy.parentFocusable) {
        const normalizedFocusable = normalizeHierarchy(focusableCopy.parentFocusable);
        delete focusableCopy['parentFocusable'];

        appendChild(normalizedFocusable, focusableCopy);
        return normalizedFocusable;
    } else {
        return focusableCopy;
    }
}  

// This method sets the single child as the sole element in the children array of the parent
// we keep the child as an array of children to match the formatting expected from the history tree
function appendChild(parent, child) {
    if (Object.keys(parent).includes('children')) {
        return appendChild(parent.children[0], child);
    } else {
        parent.children = [child];
        return parent;
    }
}
