import { noop } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types'
import Time from '../../../api/time';
import { BaseComponent } from '../base';
import 'react-datetime/css/react-datetime.css';
import TimeSpanDetail from '../TimeSpanDetail/TimeSpanDetail';

export default class TimeDetail extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        time: PropTypes.object,
        onTimeRegistered: PropTypes.func
    };

    setTime(time) {
        const updateDoc = {
            $set: {
                startDate: time.startDate,
                endDate: time.endDate,
            }
        };

        if (time.recurrence) {
            updateDoc.$set.recurrence = {
                unit: time.recurrence.unit,
                every: time.recurrence.every,
                startDate: time.recurrence.startDate,
                endDate: time.recurrence.endDate
            }
        }
        else if (this.props.event && this.props.event.recurrence) {
            updateDoc.$unset = {
                recurrence: null
            }
        }

        if (this.props.time) {
            Time.update({_id: this.props.time._id}, updateDoc, {}, (err) => {
                if (err) {
                    this.handleError(err);
                }
            });
        }
        else {
            Time.insert(updateDoc.$set, (err, result) => {
                if (!err) {
                    (this.props.onTimeRegistered || noop)(result);
                }
                else {
                    this.handleError(err);
                }
            });
        }

    }



    render() {
        if (this.props.loading) {
            return (
                <h3>loading</h3>
            )
        }
        else {
            return (
                <div className={'TimeDetail'}>
                    <TimeSpanDetail onChange={this.setTime.bind(this)}
                                timeSpan={this.props.time}/>
                </div>
            )
        }
    }
}