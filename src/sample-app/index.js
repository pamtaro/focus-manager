import React, { Component } from 'react';

import { focusableTypes } from '../FocusManager/types';
import FocusRoot from '../FocusManager/FocusRoot';
import FocusGrid from '../FocusManager/FocusGrid';

import './App.css';

class App extends Component {
  render() {  
    const rootParent = {
      type: focusableTypes.ROOT,
      path: 'index',
      index: 0
    };
    return (
      <div className="App">
        <FocusRoot {...rootParent}>
          {[...Array(3)].map((x, i) => {
            const outerGrid = {
              type: focusableTypes.GRID.HORIZONTAL,
              index: i,
              parentFocusable: rootParent
            };
            return (<FocusGrid key={i} className="grid0" { ...outerGrid }>
                <h4>Grid {i}</h4>
                {[...Array(3)].map((x, j) => {
                    const innerGrid = {
                      type: focusableTypes.GRID.VERTICAL,
                      index: j,
                      parentFocusable: outerGrid
                    };
                    return (<FocusGrid key={j} className="grid1" {...innerGrid }>
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
