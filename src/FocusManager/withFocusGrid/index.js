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
            focusableParent: PropTypes.object.isRequired,
            className: PropTypes.string,
            setFocusedItemFromComponent: PropTypes.func.isRequired,
            updateFocusHistory: PropTypes.func.isRequired,
        };          
        
        static contextTypes = {
            focusManager: PropTypes.object,
        };    
        
        constructor(props, context){
            super(props, context);

            this.updateFocusGridHistory = this.updateFocusGridHistory.bind(this);
            this.setFocus = this.setFocus.bind(this);
        }

        setFocus(focusedItem) {
            const { setFocusedItemFromComponent } = this.props;
            const { focusManager } = this.context;
            setFocusedItemFromComponent(focusManager, focusedItem);     
        }

        updateFocusGridHistory() {
            const { updateFocusHistory, index, type } = this.props;
            const { focusManager } = this.context;
            updateFocusHistory(focusManager);
        }

        render() {  
            return (<WrappedComponent { ...this.context } { ...this.props } 
                updateFocusGridHistory={this.updateFocusGridHistory}
                setFocus={this.setFocus}
                />);
        }
    };
}

export default (Component) => container(withFocusGrid(Component));
