import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withFocusItem from '../FocusManager/withFocusItem';

class FocusItem extends Component {    
  render() {
    const { className, index } = this.props;
    return (
      <div className={`focus-item ${className}`}>
          Item {index}
      </div>
    );
  }
}

export default withFocusItem(FocusItem);