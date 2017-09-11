import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withFocusItem from '../FocusManager/withFocusItem';

class FocusableItem extends Component {    
  render() {
    const { className, index, focusedStatus } = this.props;
    const statusClassName = `focus-status-${focusedStatus.toLowerCase()}`;
    return (
      <div className={`focus-item ${statusClassName} ${className}`}>
          Item {index}
      </div>
    );
  }
}

export default withFocusItem(FocusableItem);