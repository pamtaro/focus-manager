import React, { Component } from 'react';
import PropTypes from 'prop-types';

import container from './Container';

class FocusGrid extends Component {
  static propTypes = {
      index: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,      
      parentFocusable: PropTypes.object,
      className: PropTypes.string,
      registerFocusable: PropTypes.func.isRequired,   
  };

  componentDidMount() {
    const { index, type, parentFocusable, registerFocusable } = this.props;
    registerFocusable({ index, type, parentFocusable });//: { 
    //     type: parentFocusable.type,
    //     index: parentFocusable.index,
    //     parentFocusable: parentFocusable.parentFocusable
    //  }});
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
