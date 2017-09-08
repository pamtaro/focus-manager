import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FocusItem from './FocusItem';
import withFocusGrid from '../FocusManager/withFocusGrid';

class FocusGrid extends Component {    
  render() {
    const { className, index, type, parentFocusable } = this.props;
    return (
      <div className={`inner-grid ${className}`}>
          <h4>Inner Grid {index}</h4>
            {[...Array(2)].map((x, i) => {          
                const innerProps = {
                    index: i,    
                    parentFocusable: {
                        index,
                        type,
                        parentFocusable,
                    },
                }
                return (<FocusItem key={i} { ...innerProps }>
                    <h4>Item {i}</h4>
                </FocusItem>);
            })}
      </div>
    );
  }
}

export default withFocusGrid(FocusGrid);
