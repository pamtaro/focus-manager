import React from 'react';
import PropTypes from 'prop-types';

import { focusableTypes } from '../types';
import container from './Container';

function withFocusItem(WrappedComponent) {
    return class extends React.Component {
        static defaultProps = {
            type: focusableTypes.ITEM,
        };

        static propTypes = {
            index: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            parentFocusable: PropTypes.object.isRequired,
            className: PropTypes.string,
            focusHistory: PropTypes.array,
        };      

        static contextTypes = {
            focusManager: PropTypes.object,
        };  

        componentDidMount() {    
            const { index, type, parentFocusable, focusHistory } = this.props;
            const { focusManager } = this.context;
            focusManager.registerFocusable(focusHistory, {index, type, parentFocusable})
            console.log('withFocusItem -- componentDidMount');
        }

        // componentWillReceiveProps(nextProps) {
        //     const { index, type, parentFocusable, focusHistory } = this.props;
        //     const { focusManager } = this.context;
        //     focusManager.registerFocusable(focusHistory, {index, type, parentFocusable})
        // }

        render() {  
            return (<WrappedComponent { ...this.context } { ...this.props } />);
        }
    };
}

export default (Component) => container(withFocusItem(Component));
