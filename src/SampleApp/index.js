import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { focusableTypes } from '../FocusManager/types';
import { FocusManager } from '../FocusManager';
import FocusableRoot from './FocusableRoot';
import FocusableRow from './FocusableRow';
import * as keyHelpers from '../SampleApp/keyHelpers';


import './App.css';

class App extends Component {
  static childContextTypes = {
    focusManager: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.childContext = {
      focusManager: new FocusManager(keyHelpers, 0.1)
    };

    this.state = { childCount: 20 };
    this.clickHandler = this.clickHandler.bind(this);
  }
  
  getChildContext() {
      return this.childContext;
  }

  clickHandler() {
    const { childCount } = this.state;
    this.setState({ childCount: childCount+1 });
  }

  render() {  
    const { childCount } = this.state;
    const rootProps = {
      type: focusableTypes.ROOT,
      path: 'index',
      index: 0,
      rootGridDirection: focusableTypes.GRID.VERTICAL,
      className: 'sample-focus-root',
      childCount,
    }
    return (
      <div>
        <a onClick={this.clickHandler}>Add Row</a>
        <FocusableRoot {...rootProps}>
          {[...Array(childCount)].map((x, i) => {
            const outerProps = {
              index: i,
              focusableParent: rootProps
            }
            return (<FocusableRow key={i} {...outerProps} />);
          })}
        </FocusableRoot>
      </div>
    );
  }
}

export default App;
