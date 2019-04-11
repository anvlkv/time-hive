import React from 'react';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Events from '../../../api/events';
import ActivitiesList from '../ActivitiesList/ActivitiesList';
import { BaseComponent } from '../base';
import 'react-datetime/css/react-datetime.css';
import TimeSpanDetail from '../TimeSpanDetail/TimeSpanDetail';

export default class EventDetail extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        event: PropTypes.object,
        space: PropTypes.object
    };

    setEventTime(time) {
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

        Events.update({_id: this.props.event._id}, updateDoc, {}, (err) => {
            if (err) {
                this.handleError(err);
            }
        });
    }

    render() {
        if (this.props.loading) {
            return (
                <h3>loading</h3>
            )
        }
        else {
            return (
                <div>
                    <ContentEditable html={this.props.event.name}
                                     disabled={false}
                                     className={'event-name-editor'}
                                     tagName="h2"
                                     onBlur={this.onDoneEditing.bind(this)}/>
                    <TimeSpanDetail timeSpan={this.props.event}
                                    onChange={this.setEventTime.bind(this)} />
                    <ContentEditable html={this.props.event.description || '<p class="placeholder">describe it...</p>'}
                                     innerRef={this.descriptionContentEditable}
                                     disabled={false}
                                     className={'event-description-editor'}
                                     onBlur={this.onDoneEditing.bind(this)}/>
                    <hr/>
                    <h4>{this.props.event.name}'s activities</h4>
                    <ActivitiesList selectable={true}
                                    selectedActivities={this.props.event.activities}
                                    allActivities={this.props.space.activities}
                                    onSelectionChange={this.onEventActivitySelectionChange.bind(this)}/>
                </div>
            )
        }
    }

    onDoneEditing(event) {
        switch (event.target.className) {
            case 'event-name-editor':
                if (!event.target.innerText) {
                    event.preventDefault();
                }
                else {
                    Events.update(this.props.event._id, {$set:{name: event.target.innerText}}, {}, (err) => {
                        if (err) {
                            this.setState({});
                            this.handleError(err);
                        }
                    });

                }
                break;
            case 'event-description-editor':
                    Events.update(this.props.event._id, {$set:{description: event.target.innerHTML}}, {}, (err) => {
                        if (err) {
                            this.setState({});
                            this.handleError(err);
                        }
                    });
                break;
        }
    }

    onEventActivitySelectionChange(activities) {
        Events.update(this.props.event._id, {$set: {activities}}, console.log);
    }
}