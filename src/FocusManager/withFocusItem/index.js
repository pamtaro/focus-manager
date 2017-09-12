import React from 'react';
import PropTypes from 'prop-types';

import { focusableTypes, focusItemStates } from '../types';
import container from './Container';

function withFocusItem(WrappedComponent) {
    return class extends React.Component {
        static defaultProps = {
            focusedStatus: focusItemStates.DEFAULT,
            type: focusableTypes.ITEM,
        };

        static propTypes = {
            index: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            focusableParent: PropTypes.object.isRequired,
            className: PropTypes.string,
            focusHistory: PropTypes.array,
            focusingHandled: PropTypes.func.isRequired,
        };      

        static contextTypes = {
            focusManager: PropTypes.object,
        };  

        constructor(props, context) {
            super(props, context);
            this.state = { focusedStatus: props.focusedStatus };
        }

        componentDidMount() {    
            const { focusHistory } = this.props;
            const { focusManager } = this.context;
            focusManager.registerFocusable(this.props, focusHistory);
        }

        componentWillReceiveProps(nextProps) {
            const { focusManager } = this.context;
            const { focusedStatus } = this.state;
            const focusItem = focusManager.getFocusItem(this.props, nextProps.focusHistory);
            this.setState({ previousStatus: focusedStatus, focusedStatus: focusItem.focusedStatus });
        }

        componentDidUpdate() {
            const { focusingHandled } = this.props;
            const { focusedStatus, previousStatus } = this.state;
            if (focusedStatus === focusItemStates.FOCUSED && previousStatus !== focusItemStates.FOCUSED) {
                focusingHandled();
            }
        }

        render() {  
            return (<WrappedComponent { ...this.context } { ...this.props } focusedStatus={this.state.focusedStatus} />);
        }
    };
}

export default (Component) => container(withFocusItem(Component));
