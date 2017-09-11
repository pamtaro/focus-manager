import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withFocusRoot from '../FocusManager/withFocusRoot';

class FocusableRoot extends Component {     
  static propTypes = {
      childCount: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {handleUpdate: false};
  }

  componentDidUpdate() {
    const { updateFocusRootHistory } = this.props;
    const { handleUpdate } = this.state;
    if (handleUpdate) {
      updateFocusRootHistory();
      this.setState({handleUpdate: false});
    }
  }

  componentWillReceiveProps(nextProps) {
    const { childCount } = this.props;
    if (childCount !== nextProps.childCount) {
      this.setState({handleUpdate: true});
    }
  }

  render() {
    const { className, children } = this.props;
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}

export default withFocusRoot(FocusableRoot);
