import moment from 'moment';
import React from 'react';
import Datetime from 'react-datetime';
import Moment from 'react-moment';
import { BaseComponent } from '../base';
import PropTypes from 'prop-types'

class TimeSpanDetail extends BaseComponent {
    static propTypes = {
        timeSpan: PropTypes.object,
        onChange: PropTypes.func
    };

    static getDerivedStateFromProps(props, state) {
        if (props.timeSpan && !state.editingTime) {
            const derived = {
                startDate: moment(props.timeSpan.startDate),
                endDate: moment(props.timeSpan.endDate),
                recurrence: !!props.timeSpan.recurrence
            };

            if (derived.recurrence) {
                derived.unit = props.timeSpan.recurrence.unit;
                derived.every = props.timeSpan.recurrence.every;
                derived.recurrenceStartDate = moment(props.timeSpan.recurrence.startDate);
                derived.recurrenceEndDate = moment(props.timeSpan.recurrence.endDate);
            }

            state = {
                ...state,
                ...derived
            }
        }
        else if (!props.timeSpan) {
            state = {
                ...state,
                startDate: moment(),
                endDate: moment(),
                editingTime: true
            }
        }

        return state;
    }

    state = {
        startDate: '',
        endDate: '',
        every: 1,
        unit: 'Days',
        recurrenceStartDate: '',
        recurrenceEndDate: '',
        editingTime: false,
        recurrence: false
    };

    maybeRenderRecurrenceForm() {
        if (this.state.recurrence) {
            return (
                <div key={'time-recurrence'}>
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

    render() {
        if (this.state.editingTime) {
            return (
                <form key={'time-form'} onSubmit={(e) => {
                    e.preventDefault();
                    const time = {
                        startDate: this.state.startDate ? this.state.startDate.toDate() : this.state.startDate,
                        endDate: this.state.endDate ? this.state.endDate.toDate() : this.state.endDate,
                    };

                    if (this.state.recurrence) {
                        time.recurrence = {
                            unit: this.state.unit,
                            every: this.state.every,
                            startDate: this.state.recurrenceStartDate ? this.state.recurrenceStartDate.toDate() : this.state.recurrenceStartDate,
                            endDate: this.state.recurrenceEndDate ? this.state.recurrenceEndDate.toDate() : this.state.recurrenceEndDate,
                        }
                    }

                    this.props.onChange(time);
                    this.setState({editingTime: false});
                }}>
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
                        <Moment date={this.props.timeSpan.startDate}/>
                    </dd>
                    <dt>
                        End
                    </dt>
                    <dd>
                        <Moment date={this.props.timeSpan.endDate}/>
                    </dd>
                    {this.props.timeSpan.recurrence ? (() => (
                        <>
                            <dt>
                                Repeat every
                            </dt>
                            <dd>
                                {this.props.timeSpan.recurrence.every}
                            </dd>
                            <dd>
                                {this.props.timeSpan.recurrence.unit}
                            </dd>
                            <dt>
                                Starting
                            </dt>
                            <dd>
                                <Moment date={this.props.timeSpan.recurrence.startDate}/>
                            </dd>
                            <dt>
                                Until
                            </dt>
                            <dd>
                                <Moment date={this.props.timeSpan.recurrence.endDate}/>
                            </dd>
                        </>
                    ))() : ''}

                    {this.props.onChange ? (() => (
                        <button onClick={() => this.setState({editingTime: true})}>edit</button>
                    ))() : ''}
                </dl>
            )
        }
    }
}

export default TimeSpanDetail;