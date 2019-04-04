import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Events from '../../../api/events';
import ActivitiesList from '../ActivitiesList/ActivitiesList';
import { BaseComponent } from '../base';
import Moment from 'react-moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

export default class EventDetail extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        event: PropTypes.object,
        space: PropTypes.object
    };

    static getDerivedStateFromProps(props, state) {
        if (state.editingTime) return state;

        if (props.event) {
            const derived = {
                startDate: moment(props.event.startDate),
                endDate: moment(props.event.endDate),
                recurrence: !!props.event.recurrence
            };

            if (derived.recurrence) {
                derived.unit = props.event.recurrence.unit;
                derived.every = props.event.recurrence.every;
                derived.recurrenceStartDate = moment(props.event.recurrence.startDate);
                derived.recurrenceEndDate = moment(props.event.recurrence.endDate);
            }

            state = {
                ...state,
                ...derived
            }
        }
        else if (!props.loading) {
            state = {
                startDate: new Date(),
                ...state,
                editingTime: true
            }
        }

        return state;
    }

    state = {
        startDate: new Date(),
        endDate: '',
        every: 1,
        unit: 'Days',
        recurrenceStartDate: '',
        recurrenceEndDate: '',
        editingTime: false
    };

    setEventTime(e) {
        e.preventDefault();
        const updateDoc = {
            $set: {
                startDate: this.state.startDate ? this.state.startDate.toDate() : this.state.startDate,
                endDate: this.state.endDate ? this.state.endDate.toDate() : this.state.endDate
            }
        };

        if (this.state.recurrence) {
            updateDoc.$set.recurrence = {
                unit: this.state.unit,
                every: this.state.every,
                startDate: this.state.recurrenceStartDate ? this.state.recurrenceStartDate.toDate() : this.state.recurrenceStartDate,
                endDate: this.state.recurrenceEndDate ? this.state.recurrenceEndDate.toDate() : this.state.recurrenceEndDate
            }
        }
        else if (this.props.event.recurrence) {
            updateDoc.$unset = {
                recurrence: null
            }
        }

        Events.update({_id: this.props.event._id}, updateDoc, {}, (err) => {
            if (!err) {
                this.setState({editingTime: false})
            }
        })
    }

    maybeRenderRecurrenceForm() {
        if (this.state.recurrence) {
            return (
                <div key={'event-recurrence'}>
                    <label>
                        Every
                        <input type="number"
                               name="every"
                               value={this.state.every}
                               onChange={this.handleInputChange.bind(this)}/>

                    </label>
                    <select value={this.state.unit}
                            name="unit"
                            onChange={this.handleInputChange.bind(this)}>
                        <option>Hours</option>
                        <option>Days</option>
                        <option>Weeks</option>
                        <option>Months</option>
                        <option>Years</option>
                    </select>
                    <label>
                        Starting
                        <Datetime value={this.state.recurrenceStartDate}
                                  onChange={(e) => this.handleInputChange(e, 'recurrenceStartDate')} />
                    </label>
                    <label>
                        Until
                        <Datetime value={this.state.recurrenceEndDate}
                                  onChange={(e) => this.handleInputChange(e, 'recurrenceEndDate')} />
                    </label>
                </div>
            )
        }
    }

    renderTimeEditor() {
        if (this.state.editingTime) {
            return (
                <form key={'event-time-form'} onSubmit={this.setEventTime.bind(this)}>
                    <label>
                        Start
                        <Datetime value={this.state.startDate}
                                  onChange={(e) => this.handleInputChange(e, 'startDate')} />
                    </label>
                    <label>
                        End
                        <Datetime value={this.state.endDate}
                                  onChange={(e) => this.handleInputChange(e, 'endDate')} />
                    </label>
                    <fieldset>
                        <label>
                            Repeat
                            <input type="checkbox"
                                   name="recurrence"
                                   checked={this.state.recurrence}
                                   onChange={this.handleInputChange.bind(this)} />
                        </label>
                        {this.maybeRenderRecurrenceForm()}
                    </fieldset>
                    <button type="submit">Save</button>
                </form>
            )
        }
        else {
            return (
                <dl>
                    <dt>
                       Start
                    </dt>
                    <dd>
                        <Moment date={this.props.event.endDate}/>
                    </dd>
                    <dt>
                        End
                    </dt>
                    <dd>
                        <Moment date={this.props.event.endDate}/>
                    </dd>
                    {this.props.event.recurrence ? (() => (
                        <>
                            <dt>
                                Repeat every
                            </dt>
                            <dd>
                                {this.props.event.recurrence.every}
                            </dd>
                            <dd>
                                {this.props.event.recurrence.unit}
                            </dd>
                            <dt>
                                Starting
                            </dt>
                            <dd>
                                <Moment date={this.props.event.recurrence.startDate}/>
                            </dd>
                            <dt>
                                Until
                            </dt>
                            <dd>
                                <Moment date={this.props.event.recurrence.endDate}/>
                            </dd>
                        </>
                    ))(): ''}

                    <button onClick={() => this.setState({editingTime: true})}>edit</button>
                </dl>
            )
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
                <div>
                    <ContentEditable html={this.props.event.name}
                                     disabled={false}
                                     className={'event-name-editor'}
                                     tagName="h2"
                                     onBlur={this.onDoneEditing.bind(this)}/>
                    {this.renderTimeEditor()}
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
                        }
                    });

                }
                break;
            case 'event-description-editor':
                    Events.update(this.props.event._id, {$set:{description: event.target.innerHTML}}, {}, (err) => {
                        if (err) {
                            this.setState({});
                        }
                    });
                break;
        }
    }

    onEventActivitySelectionChange(activities) {
        Events.update(this.props.event._id, {$set: {activities}}, console.log);
    }
}