import React, { Component } from 'react';

import { focusableTypes } from '../FocusManager/types';
import FocusRoot from '../FocusManager/FocusRoot';
import FocusGrid from '../FocusManager/FocusGrid';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {    
    console.log('App - componentDidMount');
  }

  render() {  
    const rootParent = {
      type: focusableTypes.ROOT,
      path: 'index',
      index: 0,
    };
    const rootProps = {
      focusable: rootParent
    }
    return (
      <div className="App">
        <FocusRoot {...rootProps}>
          {[...Array(3)].map((x, i) => {
            const outerGrid = {
              type: focusableTypes.GRID.HORIZONTAL,
              index: i,
            };
            const outerProps = {
              focusable: outerGrid,
              parentFocusable: rootParent
            }
            return (<FocusGrid key={i} className="grid0" { ...outerProps }>
                <h4>Grid {i}</h4>
                {[...Array(3)].map((x, j) => {
                    const innerGrid = {
                      type: focusableTypes.GRID.VERTICAL,
                      index: j,
                    };
                    const innerProps = {
                      focusable: innerGrid,
                      parentFocusable: outerGrid
                    };
                    return (<FocusGrid key={j} className="grid1" {...innerProps }>
                      <h4>Grid {j}</h4>
                    </FocusGrid>);
                  }
                )}
              </FocusGrid>);
            }
          )}
        </FocusRoot>
      </div>
    );
  }
}

export default App;
