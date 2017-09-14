import React, { Component } from 'react';

import FocusableItem from './FocusableItem';
import FocusableRowInsideColumn from './FocusableRowInsideColumn';
import withFocusGrid from '../FocusManager/withFocusGrid';
import { focusableTypes, focusingStates } from '../FocusManager/types';

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
        const { className, index, focusableParent} = this.props;
        return (
        <div className={`inner-grid ${className}`}>
            <h4>Inner Grid {index}</h4>
                {[...Array(3)].map((x, i) => {    
                    const innerProps = {
                        index: i,    
                        focusableParent: this.props,
                    }
                    return (focusableParent.index === 2 ? <FocusableRowInsideColumn key={i} { ...innerProps } /> :
                        <FocusableItem key={i} { ...innerProps } />);
                })}
        </div>
        );
    }
}

export default withFocusGrid(FocusableColumn);
