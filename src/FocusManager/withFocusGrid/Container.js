
import { connect } from 'react-redux';
import { setFocusedItemFromComponent, updateFocusHistory, focusingHandled } from '../actions';

function mapStateToProps({ focusHistory, focusingStatus }) {
    return { focusHistory, focusingStatus };
}

function mapDispatchToProps(dispatch) {
    return {
        setFocusedItemFromComponent: (focusManager, focusedItem) => dispatch(setFocusedItemFromComponent(focusManager, focusedItem)),
        updateFocusHistory: (focusManager) => dispatch(updateFocusHistory(focusManager)),
        focusingHandled: () => dispatch(focusingHandled()),
    };
}

export default (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
