import React from 'react';
import PropTypes from 'prop-types'

export default class EventsOverviewDashboard extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        events: PropTypes.array
    };

    render() {
        return (
            <h3>Please select an event...</h3>
        )
    }
}