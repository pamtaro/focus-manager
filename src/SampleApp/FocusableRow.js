import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FocusableItem from './FocusableItem';
import FocusableColumn from './FocusableColumn';
import { focusableTypes } from '../FocusManager/types';
import withFocusGrid from '../FocusManager/withFocusGrid';

class FocusableRow extends Component {  
    
  constructor(props, context) {
    super(props, context);

    this.state = { childCount: 20 };
    this.clickHandler = this.clickHandler.bind(this);
  }
  
  componentDidUpdate() {
      const { updateFocusGridHistory } = this.props;
      const { handleUpdate } = this.state;
      if (handleUpdate) {
        updateFocusGridHistory();
        this.setState({ handleUpdate: false});
      }
  }
  
  clickHandler() {
    const { childCount } = this.state;
    this.setState({ childCount: childCount+1, handleUpdate: true });
  }  

  render() {
    const { childCount } = this.state;
    const { className, index } = this.props;
    return (
      <div className={`outer-grid ${className}`}>
        <div>
          <a onClick={this.clickHandler}>Grid{index} +</a>
        </div>
        {[...Array(childCount)].map((x, i) => {            
            const innerProps = {
                index: i,  
                focusableParent: this.props
            }
            return (false ? <FocusableColumn key={i} {...{...innerProps, type: focusableTypes.GRID.VERTICAL }} />
                : <FocusableItem key={i} { ...innerProps } />);
        })}
      </div>
    );
  }
}

export default withFocusGrid(FocusableRow);
