import React from 'react';
import PropTypes from 'prop-types'

export default class ActivitiesOverviewDashboard extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        activities: PropTypes.array
    };

    render() {
        return (
            <h3>Please select an activity...</h3>
        )
    }
}