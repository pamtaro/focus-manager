import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as helpers from '../helpers';
import container from './Container';

class FocusGrid extends Component {
  static propTypes = {
    focusable: PropTypes.object,
    parentFocusable: PropTypes.object.isRequired,
    className: PropTypes.string,
  };
  
  static contextTypes = {
    focusManager: React.PropTypes.object,
  };

  componentDidMount() {
    const { index, type, parentFocusable, focusable } = this.props;
    helpers.buildFocusableTree(parentFocusable, focusable);
  }
  
  render() {
    const { className, children } = this.props;
    return (
      <div className={`focus-grid ${className}`}>
        {children}
      </div>
    );
  }
}

export default container(FocusGrid);
