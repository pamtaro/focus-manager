import React, { Component } from 'react';

import FocusableItem from './FocusableItem';
import withFocusGrid from '../FocusManager/withFocusGrid';

class FocusableRowInsideColumn extends Component {  
  render() {
    const { className } = this.props;
    return (<div className={`third-level-grid ${className}`}>
        {[...Array(3)].map((x, i) => {            
            const innerProps = {
                index: i,  
                focusableParent: this.props
            }
            return (<FocusableItem key={i} { ...innerProps } />);
        })}
      </div>
    );
  }
}

export default withFocusGrid(FocusableRowInsideColumn);
