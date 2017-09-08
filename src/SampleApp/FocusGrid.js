import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FocusItem from './FocusItem';
import FocusGridInner from './FocusGridInner';
import { focusableTypes } from '../FocusManager/types';
import withFocusGrid from '../FocusManager/withFocusGrid';

class FocusGrid extends Component {  
    
  constructor(props, context) {
    super(props, context);

    this.state = { childCount: 3 };
    this.clickHandler = this.clickHandler.bind(this);
  }
  
  componentDidUpdate() {
      const { updateFocusGridHistory } = this.props;
      updateFocusGridHistory();
  }
  
  clickHandler() {
    const { childCount } = this.state;
    this.setState({ childCount: childCount+1 });
  }  

  render() {
    const { childCount } = this.state;
    const { className, index, type, parentFocusable } = this.props;
    return (
      <div className={`outer-grid ${className}`}>
        <a onClick={this.clickHandler}>Add Child</a>
          <h4>Outer Grid {index}</h4>
        {[...Array(childCount)].map((x, i) => {            
            const innerProps = {
                index: i,  
                parentFocusable: {
                    index,
                    type,
                    parentFocusable,
                },
            }
            return (index % 2 === 0 ? <FocusGridInner key={i} {...{...innerProps, type: focusableTypes.GRID.VERTICAL }} />
                : <FocusItem key={i} { ...innerProps } />);
        })}
      </div>
    );
  }
}

export default withFocusGrid(FocusGrid);
