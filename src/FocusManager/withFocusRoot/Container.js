
import { connect } from 'react-redux';
import { updateFocusHistory, rootMounted, focusingHandled, updateFocusingStatus } from '../actions';

function mapStateToProps({ focusHistory, focusingStatus }) {
    return { focusHistory, focusingStatus };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFocusHistory: (focusManager) => dispatch(updateFocusHistory(focusManager)),
        rootMounted: () => dispatch(rootMounted()),
        focusingHandled: () => dispatch(focusingHandled()),
        updateFocusingStatus: (status) => dispatch(updateFocusingStatus(status)),
    };
}

export default (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
