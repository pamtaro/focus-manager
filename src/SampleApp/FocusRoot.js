import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withFocusRoot from '../FocusManager/withFocusRoot';

class FocusRoot extends Component {    
  render() {
    const { className, children } = this.props;
    return (
      <div className={`focus-root ${className}`}>
        {children}
      </div>
    );
  }
}

export default withFocusRoot(FocusRoot);
