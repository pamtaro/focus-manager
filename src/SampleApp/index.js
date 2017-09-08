import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { focusableTypes } from '../FocusManager/types';
import { FocusManager } from '../FocusManager';
import FocusRoot from './FocusRoot';
import FocusGrid from './FocusGrid';

import './App.css';

class App extends Component {
  static childContextTypes = {
    focusManager: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.childContext = {
      focusManager: new FocusManager()
    };

    this.state = { childCount: 3 };
    this.clickHandler = this.clickHandler.bind(this);
  }
  
  getChildContext() {
      return this.childContext;
  }

  componentDidMount() {    
  }

  clickHandler() {
    const { childCount } = this.state;
    this.setState({ childCount: childCount+1 });
  }

  render() {  
    const { childCount } = this.state;
    const rootFocusable = {
      type: focusableTypes.ROOT,
      path: 'index',
      index: 0,
    };
    const rootProps = {
      ...rootFocusable
    }
    return (
      <div className="App">
        <a onClick={this.clickHandler}>Add Row</a>
        <FocusRoot {...rootProps}>
          {[...Array(childCount)].map((x, i) => {
            const outerProps = {
              index: i,
              parentFocusable: rootFocusable
            }
            return (<FocusGrid key={i} {...outerProps} />);
          })}
        </FocusRoot>
      </div>
    );
  }
}

export default App;
