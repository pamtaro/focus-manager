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

    const focusManager = new FocusManager(keyHelpers, 0.01);

    this.childContext = { focusManager };

    const currentFocusRootId = focusManager.getNextFocusRootId('/index');

    this.state = { childCount: 20, currentFocusRootId };
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
    const { currentFocusRootId } = this.state;

    const rootProps = {
      type: focusableTypes.ROOT,
      id: currentFocusRootId, 
      index: 0,
      rootGridDirection: focusableTypes.GRID.VERTICAL,
      className: 'sample-focus-root',
      childCount,
    }
    return (
      <FocusableRoot {...rootProps}>
        <a onClick={this.clickHandler}>Add Row</a>
        {[...Array(childCount)].map((x, i) => {
          const outerProps = {
            index: i,
            focusableParent: rootProps
          }
          return (<FocusableRow key={i} {...outerProps} childCount={childCount} />);
        })}
      </FocusableRoot>
    );
  }
}

export default App;
