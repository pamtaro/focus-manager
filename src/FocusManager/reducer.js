import { actionTypes, focusableTypes } from './types';

const defaultState = {
    focusHistory: []
};

function appendChild(parent, child) {
    if (Object.keys(parent).includes('children')) {
        return appendChild(parent.children[0], child);
    } else {
        parent.children = [child];
        return parent;
    }
}

// This method reverses the incoming hierarchy received from a focusable component that contains a referene to it's parent.
// In order to be stored more efficiently in the focusHistory, the hierachy tree need to start at the root and contain children.
export function normalizeHierarchy(focusable) {
    if (focusable.parentFocusable) {
        const normalizedFocusable = normalizeHierarchy(focusable.parentFocusable);
        delete focusable['parentFocusable'];

        appendChild(normalizedFocusable, focusable);
        return normalizedFocusable;
    } else {
        return focusable;
    }
}  

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.FOCUS.REGISTER_FOCUSABLE: {
            const { focusable } = action;
            const normalizedFocusable = normalizeHierarchy(focusable);
            if (normalizedFocusable.type !== focusableTypes.ROOT) {
                throw 'normalizedFocusable must start with a ROOT';
            }

            const { focusHistory } = state;
            // find any focus roots that might already be in the history
            const existingFocusRoots = focusHistory.filter(history => history.path === normalizedFocusable.path);
            if (existingFocusRoots.length > 0 && normalizedFocusable.index != null && !isNaN(normalizedFocusable.index) 
                && existingFocusRoots.length > normalizedFocusable.index && normalizedFocusable.children) {
                    // if existing focus roots were found AND an index for the normalizedFocusable was included within the existing roots
                    // AND the normalizedFocusable has passed a children array, then we are updating the normalizedFocusable root's children
                    const updatedFocusRoot = focusHistory.find(history => history.index === normalizedFocusable.index);                    
                    if (updatedFocusRoot.children && updatedFocusRoot.children.length > 0) {
                        const existingFocusChild = updatedFocusRoot.children.find(child => child.index === normalizedFocusable.children[0].index);
                        if (existingFocusChild) {
                            const updatedFocusChild = {
                                ...existingFocusChild,
                                ...normalizedFocusable.children[0]
                            };
                            // replace the focusChild in the updateFocusRoot children array with the updated focus child
                            const existingFocusChildIndex = updatedFocusRoot.children.findIndex(child => child.index === normalizedFocusable.children[0].index);
                            updatedFocusRoot.children.splice(existingFocusChildIndex, 1, updatedFocusChild);
                        } else {
                            updatedFocusRoot.children.push(normalizedFocusable.children[0]);
                        }
                    } else {
                        // children for this root do not exist yet, so add this normalizedFocusable child as it's first one
                        updatedFocusRoot.children = normalizedFocusable.children;
                    }
                    // replace the focusRoot in the existing focusHistory array with the updated focus root
                    const existingRootIndex = focusHistory.findIndex(history => history.index === normalizedFocusable.index);
                    focusHistory.splice(existingRootIndex, 1, updatedFocusRoot);
            } else {
                // if not focus roots are found for the given path, or the focus index for this path was not set, 
                // then push this normalizedFocusable object onto the history array and assign it's index to the length that was found
                // i.e., if the length is 0, then, this is the first focus root for this path in the history array
                normalizedFocusable.index = existingFocusRoots.length;
                focusHistory.push(normalizedFocusable);
            }
            return { ...state, focusHistory };
        }

        default:
            return state;

    };
}
