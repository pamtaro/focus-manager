import React from 'react';
import PropTypes from 'prop-types';

import { focusableTypes } from '../types';
import container from './Container';

function withFocusGrid(WrappedComponent) {
    return class extends React.Component {
        static defaultProps = {
            type: focusableTypes.GRID.HORIZONTAL,
        };

        static propTypes = {
            index: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            parentFocusable: PropTypes.object.isRequired,
            className: PropTypes.string,
            updateFocusHistory: PropTypes.func.isRequired,
        };          
        
        static contextTypes = {
            focusManager: PropTypes.object,
        };    
        
        constructor(props, context){
            super(props, context);

            this.updateFocusGridHistory = this.updateFocusGridHistory.bind(this);
        }

        updateFocusGridHistory() {
            const { updateFocusHistory, index, type } = this.props;
            const { focusManager } = this.context;
            const focusHistory = focusManager.getFocusHistory();
            updateFocusHistory(focusHistory);
        }

        render() {  
            return (<WrappedComponent { ...this.context } { ...this.props } updateFocusGridHistory={this.updateFocusGridHistory} />);
        }
    };
}

export default (Component) => container(withFocusGrid(Component));
