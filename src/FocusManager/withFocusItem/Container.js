
import { connect } from 'react-redux';

function mapStateToProps({ focusHistory }) {
    return { focusHistory };
}

export default (Component) => connect(mapStateToProps)(Component);
