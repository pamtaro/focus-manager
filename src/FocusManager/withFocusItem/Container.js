
import { connect } from 'react-redux';
import { focusingHandled } from '../actions';


function mapStateToProps({ focusHistory, focusingStatus }) {
    return { focusHistory, focusingStatus };
}

function mapDispatchToProps(dispatch) {
    return {
        focusingHandled: () => dispatch(focusingHandled()),
    };
}

export default (Component) => connect(mapStateToProps, mapDispatchToProps)(Component);
