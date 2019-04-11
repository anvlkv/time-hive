import React from 'react';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Spaces from '../../../api/spaces';
import ActivitiesList from '../ActivitiesList/ActivitiesList';
import { withRouter } from 'react-router-dom'
import { BaseComponent } from '../base';
import EventsList from '../EventsList/EventsList';
import './SpaceDetail.scss';

class SpaceDetail extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        space: PropTypes.object,
        activities: PropTypes.array,
        events: PropTypes.array
    };

    static getDerivedStateFromProps(props, state) {
        if (props.space) {
            state.spaceName = props.space.name ? props.space.name : `What is it?`;
            state.spaceDescription = props.space.description ? props.space.description : `<p class="placeholder">What's about ${props.space.name || 'it'}?</p>`;
        }

        return state;
    }

    constructor(props) {
        super(props);
        this.descriptionContentEditable = React.createRef();
        this.nameContentEditable = React.createRef();
        this.state = {spaceDescription: '', spaceName: ''};
    };

    render() {
        if (this.props.loading) {
            return (
                <h3>loading</h3>
            )
        }
        else {
            return (
                <div className={'SpaceDetail'}>
                    <ContentEditable html={this.state.spaceName}
                                     innerRef={this.nameContentEditable}
                                     disabled={false}
                                     onBlur={this.onDoneEditing.bind(this)}
                                     className={'space-name-editor'}
                                     tagName={'h1'}/>

                    <ContentEditable html={this.state.spaceDescription}
                                     innerRef={this.descriptionContentEditable}
                                     disabled={false}
                                     className={'space-description-editor'}
                                     onBlur={this.onDoneEditing.bind(this)}/>
                    <hr/>
                    <div>
                        <h3>{this.props.space.name}'s Activities</h3>
                        <ActivitiesList allActivities={this.props.space.activities}
                                        editable={true}
                                        onActivityAdded={this.onActivityAdded.bind(this)}
                                        onActivityRemoved={this.onActivityRemoved.bind(this)}/>
                    </div>
                    <div>
                        <h3>{this.props.space.name}'s Events</h3>
                        <EventsList allEvents={this.props.space.events}
                                        editable={true}
                                        onEventAdded={this.onEventAdded.bind(this)}
                                        onEventRemoved={this.onEventRemoved.bind(this)}/>
                    </div>
                    <hr/>
                    <button onClick={this.destroySpace.bind(this)}>Destroy space</button>
                </div>
            )
        }

    }

    onActivityAdded(activityId) {
        Meteor.call('AddActivityToSpace', {activityId, spaceId: this.props.space._id});
    }

    onEventAdded(eventId) {
        Meteor.call('AddEventToSpace', {eventId, spaceId: this.props.space._id});
    }

    onActivityRemoved(activityId) {
        console.log(activityId, this.props.space.activities.find(a => a._id === activityId));
    }

    onEventRemoved(eventId) {
        console.log(eventId, this.props.space.events.find(a => a._id === eventId));
    }

    onDoneEditing(event) {
        switch (event.target.className) {
            case 'space-name-editor':
                if (!event.target.innerText) {
                    event.preventDefault();
                }
                else {
                    Spaces.update(this.props.space._id, {$set:{name: event.target.innerText}}, {}, (err, result) => {
                        if (err || !result) {
                            this.setState(SpaceDetail.getDerivedStateFromProps(this.props, this.state));
                            this.handleError(err);
                        }
                    });

                }
                break;
            case 'space-description-editor':
                Spaces.update(this.props.space._id, {$set:{description: event.target.innerHTML}}, {}, (err, result) => {
                    if (err || !result) {
                        this.setState(SpaceDetail.getDerivedStateFromProps(this.props, this.state));
                        this.handleError(err);
                    }
                });
                break;
        }
    }

    destroySpace() {
        const id = this.props.space._id;
        Spaces.remove({_id: id});
        this.props.history.push('/space');

    }


}

export default withRouter(SpaceDetail);