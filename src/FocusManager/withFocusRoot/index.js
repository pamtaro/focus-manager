import React from 'react';
import PropTypes from 'prop-types';

import { focusableTypes } from '../types';
import container from './Container';

function withFocusRoot(WrappedComponent) {
    return class extends React.Component {
        static defaultProps = {
            type: focusableTypes.ROOT,
        };

        static propTypes = {
            index: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,      
            path: PropTypes.string,
            className: PropTypes.string,
            updateFocusHistory: PropTypes.func.isRequired,
        };        
        
        static contextTypes = {
            focusManager: PropTypes.object,
        };  

        componentDidMount() {    
            this.updateFocusRootHistory();
        }

        componentDidUpdate() {
            this.updateFocusRootHistory();
        }

        updateFocusRootHistory() {
            const { updateFocusHistory } = this.props;
            const { focusManager } = this.context;
            const focusHistory = focusManager.getFocusHistory();
            updateFocusHistory(focusHistory);
        }

        render() {  
            return (<WrappedComponent { ...this.context } { ...this.props } updateFocusRootHistory={this.updateFocusRootHistory} />);
        }
    };
}

export default (Component) => container(withFocusRoot(Component));
