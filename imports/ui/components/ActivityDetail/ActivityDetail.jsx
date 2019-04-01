import React from 'react';
import PropTypes from 'prop-types'

export default class ActivityDetail extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        activity: PropTypes.object
    };

    render() {
        return (
            <h3>{(this.props.activity || {}).name}</h3>
        )
    }
}