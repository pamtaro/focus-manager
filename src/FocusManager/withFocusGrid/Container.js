
import { connect } from 'react-redux';
import { setFocusedItem, updateFocusHistory, focusingHandled } from '../actions';

function mapStateToProps({ focusHistory, focusingStatus }) {
    return { focusHistory, focusingStatus };
}

function mapDispatchToProps(dispatch) {
    return {
        setFocusedItem: (focusManager, focusedItem) => dispatch(setFocusedItem(focusManager, focusedItem)),
        updateFocusHistory: (focusManager) => dispatch(updateFocusHistory(focusManager)),
        focusingHandled: () => dispatch(focusingHandled()),
    };
}

export default (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
