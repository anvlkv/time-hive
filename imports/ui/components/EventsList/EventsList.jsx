import React from 'react';
import './EventsList.scss';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Events from '../../../api/events';
import { BaseComponent } from '../base';

export default class EventsList extends BaseComponent {
    static propTypes = {
        allEvents: PropTypes.array,
        selectedEvents: PropTypes.array,
        onEventAdded: PropTypes.func,
        onEventRemoved: PropTypes.func,
        onSelectionChange: PropTypes.func,
        editable: PropTypes.bool,
        selectable: PropTypes.bool
    };

    state = {
        newEventName: ''
    };

    constructor(props) {
        super(props);
    }

    renderEvent(event) {
        return (
            <li key={`event-list-item-${event._id}`}>
                {this.maybeRenderSelectionControl(event)}
                <ContentEditable html={event.name}
                                 disabled={!this.props.editable}
                                 className={'event-name'}
                                 onBlur={(e) => this.updateEventName(e.target.innerText, event)}/>
                {this.maybeRenderDeleteButton(event)}
            </li>
        )
    }

    updateEventName(name, event) {
        if (name && event.name !== name) {
            Events.update(event._id, {$set: {name}}, {}, (err) => {
                if(err) {
                    this.setState({});
                    this.handleError(err);
                }
            });
        }

    }

    maybeRenderAddButton(){
        if (this.props.editable) {
            return (
                <li key={'add-event-list-item'} className={'add-event-list-item'}>
                    <input type="text" name="newEventName" value={this.state.newEventName} onChange={this.handleInputChange.bind(this)}/>
                    <button onClick={() => this.onAddButtonClick()}>Add</button>
                </li>
            )
        }
    }

    onAddButtonClick(name = this.state.newEventName) {
        Events.insert({name}, (err, result) => {
            if(err) {
                this.setState({});
                this.handleError(err);
            }
            else {
                this.props.onEventAdded(result);
                this.setState({newEventName: ''});
            }
        });
    }

    maybeRenderDeleteButton(event){
        if (this.props.editable) {
            return (<button key={`remove-event-${event._id}`} onClick={() => this.onDeleteButtonClick(event._id)}>X</button>)
        }
    }

    onDeleteButtonClick(eventId) {
        // console.log(this, activity);
        Events.remove(eventId, (a, b) => {
            console.log(a, b);
        });
    }

    maybeRenderSelectionControl(event) {

    }

    render() {
        return (
            <ul className={'EventsList'}>
                {this.props.allEvents.map(this.renderEvent.bind(this))}
                {this.maybeRenderAddButton()}
            </ul>
        );
    }
}
