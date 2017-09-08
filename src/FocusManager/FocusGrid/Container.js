
import { connect } from 'react-redux';
import { registerFocusable } from '../actions';

function mapStateToProps({ focusHistory }) {
    return { focusHistory };
}

function mapDispatchToProps(dispatch) {
    return {
        registerFocusable: (focusable) => dispatch(registerFocusable(focusable)),
    };
}

export default (Component) => connect(null, mapDispatchToProps)(Component);
