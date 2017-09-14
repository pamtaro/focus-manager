import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { focusableTypes, focusableStates } from '../types';
import container from './Container';

function withFocusItem(WrappedComponent) {
    return class extends React.Component {
        static defaultProps = {
            focusedStatus: focusableStates.DEFAULT,
            type: focusableTypes.ITEM,
        };

        static propTypes = {
            // props just for component
            className: PropTypes.string,
            focusableParent: PropTypes.object.isRequired,
            
            // props included in focusHistory
            id: PropTypes.string,
            index: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            
            // props from redux state
            focusHistory: PropTypes.object,
            focusingStatus: PropTypes.string,

            // props from redux dispatch
            focusingHandled: PropTypes.func.isRequired,
        };      

        static contextTypes = {
            focusManager: PropTypes.object,
        };  

        constructor(props, context) {
            super(props, context);
            const { focusableParent, id, index } = props;
            
            // if an id wasn't passed into the component's props, use the formatted id that prepends the parent's id
            // with '_i#' and this item's index to keep the current item component unique            
            let formattedId = id || `${focusableParent.id}_i#${index}`;
            this.state = { focusedStatus: props.focusedStatus, id: formattedId };
        }

        componentDidMount() {    
            const { focusManager } = this.context;
            const { id } = this.state;
            const focusable = {
                ...this.props,
                id,
            }
            focusManager.registerFocusable(focusable);
        }

        componentWillReceiveProps(nextProps) {
            const { focusManager } = this.context;
            const { focusedStatus, id } = this.state;
            const focusItemStatus = focusManager.getFocusItemStatus(id, nextProps.focusHistory);
            this.setState({ previousStatus: focusedStatus, focusedStatus: focusItemStatus });
        }

        componentDidUpdate() {
            const { focusingHandled } = this.props;
            const { focusedStatus, previousStatus } = this.state;
            if (focusedStatus === focusableStates.FOCUSED && previousStatus !== focusableStates.FOCUSED) {
                const node = ReactDOM.findDOMNode(this);
                node.focus();
                focusingHandled();
            }
        }

        render() {  
            const { focusedStatus, id } = this.state;
            return (<div className="focus-item-wrapper" tabIndex="0">
                    <WrappedComponent { ...this.context } { ...{...this.props, focusedStatus, id }} />
                </div>);
        }
    };
}

export default (Component) => container(withFocusItem(Component));
