
import { connect } from 'react-redux';
import { updateFocusHistory, rootMounted, focusingHandled, moveFocus } from '../actions';

function mapStateToProps({ focusHistory, focusingStatus }) {
    return { focusHistory, focusingStatus };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFocusHistory: (focusManager) => dispatch(updateFocusHistory(focusManager)),
        rootMounted: () => dispatch(rootMounted()),
        focusingHandled: () => dispatch(focusingHandled()),
        moveFocus: (focusManager, status) => dispatch(moveFocus(focusManager, status)),
    };
}

export default (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
