
import { connect } from 'react-redux';
import { registerFocusRoot } from '../actions';

function mapStateToProps({ focusHistory }) {
    return { focusHistory };
}

function mapDispatchToProps(dispatch) {
    return {
        registerFocusRoot: (focusable) => dispatch(registerFocusRoot(focusable)),
    };
}

export default (Component) => connect(null, mapDispatchToProps)(Component);
