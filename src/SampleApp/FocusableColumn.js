import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FocusableItem from './FocusableItem';
import withFocusGrid from '../FocusManager/withFocusGrid';
import { focusableTypes, focusItemStates, focusingStates } from '../FocusManager/types';

class FocusableColumn extends Component {  
    componentWillReceiveProps(nextProps) {
        const { index, focusableParent, setFocus, focusingStatus } = this.props;
        // This code demonstrates how to set the initial focused item after the FOCUS.ROOT has finished mounting
        // and the components on the page are registered by the focus manager, so it's ready to set the focus
        if (focusingStatus !== nextProps.focusingStatus && nextProps.focusingStatus === focusingStates.ROOT_MOUNTED) {
            // Set the focus to the first row > first column > first item
            if (focusableParent.index === 0 && index === 0) {
                const focusable = {
                    index: 0,
                    type: focusableTypes.ITEM,
                    focusableParent: this.props,
                };
                setFocus(focusable);
            }
        }
    }

    render() {
        const { className, index } = this.props;
        return (
        <div className={`inner-grid ${className}`}>
            <h4>Inner Grid {index}</h4>
                {[...Array(2)].map((x, i) => {    
                    const innerProps = {
                        index: i,    
                        focusableParent: this.props,
                    }
                    return (<FocusableItem key={i} { ...innerProps }>
                        <h4>Item {i}</h4>
                    </FocusableItem>);
                })}
        </div>
        );
    }
}

export default withFocusGrid(FocusableColumn);
