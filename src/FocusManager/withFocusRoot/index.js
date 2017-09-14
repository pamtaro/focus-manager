import React from 'react';
import PropTypes from 'prop-types';

import { focusableTypes } from '../types';
import container from './Container';

function withFocusRoot(WrappedComponent) {
    return class extends React.Component {
        static defaultProps = {
            type: focusableTypes.ROOT,
            rootGridDirection: focusableTypes.GRID.VERTICAL,
        };

        static propTypes = {
            // props just for component
            className: PropTypes.string,

            // props included in focusHistory
            activeChildId: PropTypes.string,
            id: PropTypes.string.isRequired,
            index: PropTypes.number.isRequired,
            rootGridDirection: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,  

            // props from redux state
            focusHistory: PropTypes.object,
            focusingStatus: PropTypes.string,

            // props from redux dispatch
            updateFocusHistory: PropTypes.func.isRequired,
            rootMounted: PropTypes.func.isRequired,
            setCurrentFocusRootId: PropTypes.func.isRequired,
            moveFocus: PropTypes.func.isRequired,
        };        
        
        static contextTypes = {
            focusManager: PropTypes.object,
        };  

        constructor(props, context) {
            super(props, context);

            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.updateFocusRootHistory = this.updateFocusRootHistory.bind(this);
        }

        componentDidMount() {    
            const { rootMounted, id, setCurrentFocusRootId } = this.props;
            const { focusManager } = this.context;
            
            // manually handle focusing by listening for key events
            window.addEventListener('keydown', this.handleKeyDown);

            setCurrentFocusRootId(id, focusManager);
            this.updateFocusRootHistory();
            rootMounted();
        }
        
        componentWillUnmount() {
            window.removeEventListener('keydown', this.handleKeyDown);
        }

        updateFocusRootHistory() {
            const { updateFocusHistory } = this.props;
            const { focusManager } = this.context;
            updateFocusHistory(focusManager);
        }

        handleKeyDown(event) {
            const { moveFocus } = this.props;
            const { focusManager } = this.context;

            // throttle key down handler so animations don't get out of sync with key handling
            if (!this.keyDownTimer) {
                let handled = false;

                const focusingStatus = focusManager.getFocusDirectionalStatus(event.which);
                if (focusingStatus) {
                    handled = true;
                    moveFocus(focusManager, focusingStatus);
                }
    
                if (handled) {
                    event.stopPropagation();
                    event.preventDefault();
                }
    
                const delay = focusManager.getTransitionDuration() * 1000; // i.e., 0.2 * 1000 to get 200 milliseconds
                this.keyDownTimer = setTimeout(() => {
                    this.keyDownTimer = false;
                }, delay);
            }
        }    

        render() {
            return (<WrappedComponent { ...this.context } { ...this.props } updateFocusRootHistory={this.updateFocusRootHistory} />);
        }
    };
}

export default (Component) => container(withFocusRoot(Component));