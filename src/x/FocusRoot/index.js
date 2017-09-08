import React, { Component } from 'react';
import PropTypes from 'prop-types';

import container from './Container';

class FocusRoot extends Component {
  static propTypes = {
    focusable: PropTypes.object,
      className: PropTypes.string,
      registerFocusRoot: PropTypes.func.isRequired,      
  };
  
  static contextTypes = {
    focusManager: React.PropTypes.object,
  };

  
  constructor(props) {
      super(props);

      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.keyDownTimer = false;
  }
  
  componentDidMount() {
    const { focusable, registerFocusRoot } = this.props;
    console.log(focusable)
    registerFocusRoot(focusable);

      // manually handle focusing by listening for key events
      window.addEventListener('keydown', this.handleKeyDown);
  }
  
  componentWillUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    //   const { focusChanging, isAnyDirectionalKey, transitionDuration } = this.props;

      // throttle - check that keyDownTimer is false so we can fire the event immediately
      // and then wait on transitionDuration Timeout until capturing the next event
      if (!this.keyDownTimer) {
          let handled = false;
        //   if (isAnyDirectionalKey(event.which)) {
        //       handled = true;
        //       focusChanging(event.which);
        //   }

          if (handled) {
              event.stopPropagation();
              event.preventDefault();
          }

        //   const delay = transitionDuration * 1000; // i.e., 0.2 * 1000 to get 200 milliseconds
        //   this.keyDownTimer = setTimeout(() => {
        //       this.keyDownTimer = false;
        //   }, delay);
      }
  }
  
  render() {
    const { className, children } = this.props;
    return (
      <div className={`focus-root ${className}`}>
        {children}
      </div>
    );
  }
}

export default container(FocusRoot);
