import React from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { BaseComponent } from '../base';
import TimeDetail from '../TimeDetail/TimeDetail';
import './TimeOverviewDashboard.scss';

class TimeOverviewDashboard extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        time: PropTypes.array,
        history: PropTypes.object
    };

    render() {
        if (this.props.loading) {
            return (
                <div>
                    loading
                </div>
            )
        }
        return (
            <div className={'TimeOverviewDashboard'}>
                <h3>
                    you own time
                </h3>
                {this.props.time.map((t, i) => {
                    return (
                        <TimeDetail key={`time-detail-${i}`} time={t}/>
                    )
                })}

                <TimeDetail onTimeRegistered={this.onTimeRegistered.bind(this)}/>
            </div>
        )
    }

    onTimeRegistered(id) {
        console.log(id);
        // this.props.history.push(`${this.props.history.location.pathname}/${}`)
    }
}

export default withRouter(TimeOverviewDashboard)