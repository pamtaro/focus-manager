
import { connect } from 'react-redux';
import { setCurrentFocusRootId, updateFocusHistory, rootMounted, focusingHandled, moveFocus } from '../actions';

function mapStateToProps({ focusHistory, focusingStatus }) {
    return { focusHistory, focusingStatus };
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentFocusRootId: (id, focusManager) => dispatch(setCurrentFocusRootId(id, focusManager)),
        updateFocusHistory: (focusManager) => dispatch(updateFocusHistory(focusManager)),
        rootMounted: () => dispatch(rootMounted()),
        focusingHandled: () => dispatch(focusingHandled()),
        moveFocus: (focusManager, status) => dispatch(moveFocus(focusManager, status)),
    };
}

export default (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
