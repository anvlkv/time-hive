import React from 'react';
import PropTypes from 'prop-types'

export default class EventDetail extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        event: PropTypes.object
    };

    render() {
        return (
            <h3>{(this.props.event || {}).name}</h3>
        )
    }
}