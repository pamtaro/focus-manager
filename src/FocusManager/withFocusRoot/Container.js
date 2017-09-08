
import { connect } from 'react-redux';
import { updateFocusHistory } from '../actions';

function mapStateToProps({ focusHistory }) {
    return { focusHistory };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFocusHistory: (focusHistory) => dispatch(updateFocusHistory(focusHistory)),
    };
}

export default (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
