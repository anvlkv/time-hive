import React from 'react';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Popup from 'reactjs-popup';
import Spaces from '../../../api/spaces';
import ActivitiesList from '../ActivitiesList/ActivitiesList';
import { withRouter } from 'react-router-dom'
import AgreementDetailContainer from '../AgreementDetail/AgreementDetailContainer';
import { BaseComponent } from '../base';
import EventsList from '../EventsList/EventsList';
import './SpaceDetail.scss';
import UserBadgeContainer from '../UserBadge/UserBadgeContainer';

class SpaceDetail extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        space: PropTypes.object,
        activities: PropTypes.array,
        events: PropTypes.array,
        agreement: PropTypes.object
    };

    static getDerivedStateFromProps(props, state) {
        if (props.space) {
            state.spaceName = props.space.name ? props.space.name : `What is it?`;
            state.spaceDescription = props.space.description ? props.space.description : `<p class="placeholder">What's about ${props.space.name || 'it'}?</p>`;
        }

        return state;
    }

    state = {
        spaceDescription: '',
        spaceName: '',
        contributorAgreementFormOpen: false
    };

    constructor(props) {
        super(props);
        this.descriptionContentEditable = React.createRef();
        this.nameContentEditable = React.createRef();
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
                                     disabled={!this.props.space.isUserMaintainer()}
                                     onBlur={this.onDoneEditing.bind(this)}
                                     className={'space-name-editor'}
                                     tagName={'h1'}/>
                    <div className="contributors">
                        <h3>Contributors</h3>
                        <ul>
                            {this.props.space.contributors ? this.props.space.contributors.map(c => {
                                if (c.confirmed || this.props.space.isUserMaintainer() || c.id === Meteor.userId()) {
                                    const ConfirmContributor = !c.confirmed && this.props.space.isUserMaintainer() ?
                                        (<button onClick={this.confirmContributor.bind(this, c.id)}>Confirm</button>) : '';
                                    const RemoveContributor = this.props.space.isUserMaintainer() ?
                                        (<button onClick={this.removeContributor.bind(this, c.id)}>Remove</button>) : '';
                                    return (
                                        <li key={`contributors-${c.id}`}>
                                            <UserBadgeContainer userId={c.id}/>
                                            {ConfirmContributor}
                                            {RemoveContributor}
                                        </li>
                                    );
                                }
                            }) : (
                                <li>
                                   ...no contributors yet
                                </li>
                            )}
                            {!this.props.space.isUserContributor() && !this.props.space.isUserMaintainer() ? (
                                <li>
                                    <Popup open={this.state.contributorAgreementFormOpen}
                                           onOpen={() => this.setState({contributorAgreementFormOpen: true})}
                                           closeOnDocumentClick
                                           trigger={(<button>Join this space as a Contributor</button>)}>
                                        <AgreementDetailContainer onAgreementSubmitted={() => {
                                            this.setState({contributorAgreementFormOpen: false})
                                        }} space={this.props.space}/>
                                    </Popup>
                                </li>
                            ) : ''}
                        </ul>
                    </div>
                    <ContentEditable html={this.state.spaceDescription}
                                     innerRef={this.descriptionContentEditable}
                                     disabled={!this.props.space.isUserMaintainer()}
                                     className={'space-description-editor'}
                                     onBlur={this.onDoneEditing.bind(this)}/>
                    <hr/>
                    <div>
                        <h3>{this.props.space.name}'s Activities</h3>
                        <ActivitiesList allActivities={this.props.space.activities}
                                        editable={this.props.space.isUserMaintainer()}
                                        selectable={this.props.space.isUserContributor()}
                                        selectedActivities={this.props.agreement ? this.props.space.activities.filter(a => {
                                            return this.props.agreement.activities.findIndex(aa => aa._id === a._id) >= 0;
                                        }) : null}
                                        onActivityAdded={this.onActivityAdded.bind(this)}
                                        onSelectionChange={this.onActivitySelectionChanged.bind(this)}
                                        onActivityRemoved={this.onActivityRemoved.bind(this)}/>
                    </div>
                    <div>
                        <h3>{this.props.space.name}'s Events</h3>
                        <EventsList allEvents={this.props.space.events}
                                        editable={this.props.space.isUserMaintainer()}
                                        onEventAdded={this.onEventAdded.bind(this)}
                                        onEventRemoved={this.onEventRemoved.bind(this)}/>
                    </div>
                    <hr/>
                    <div className="maintainers">
                        <h3>Maintainers</h3>
                        <ul>
                            {this.props.space.maintainers.map(m => {
                                if (m.confirmed || this.props.space.isUserMaintainer()) {
                                    const ConfirmMaintainer = !m.confirmed && this.props.space.isUserMaintainer() ?
                                        (<button onClick={this.confirmMaintainer.bind(this, m.id)}>Confirm</button>) : '';
                                    const RemoveMaintainer = this.props.space.isUserMaintainer() && Meteor.userId() !== m.id ?
                                        (<button onClick={this.removeMaintainer.bind(this, m.id)}>Remove</button>) : '';
                                    return (
                                        <li key={`maintainer-${m.id}`}>
                                            <UserBadgeContainer userId={m.id}/>
                                            {ConfirmMaintainer}
                                            {RemoveMaintainer}
                                        </li>
                                    );
                                }
                            })}
                            {this.props.space.isUserMaintainer() || !Meteor.userId() ? '' : (
                                <li>
                                    <button onClick={this.joinSpace.bind(this, 'Maintainer')}>Join this space as a Maintainer</button>
                                </li>
                            )}
                        </ul>
                    </div>
                    {this.props.space.isUserMaintainer() ? (
                        <div>
                            <hr/>
                            <button onClick={this.leaveSpace.bind(this)}>Leave space</button>
                            {this.props.space.maintainers.length > 1 ? (
                                <span>You should be the last maintainer to destroy this space</span>
                            ) :  (
                                <></>
                            )}
                            <button disabled={this.props.space.maintainers.length > 1} onClick={this.destroySpace.bind(this)}>Destroy space</button>
                        </div>
                    ) : ''}
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

    onActivitySelectionChanged(selectedActivities) {
        Meteor.call('AddActivitiesToAgreement', {selectedActivitiesIds: selectedActivities.map(a => a._id), spaceId: this.props.space._id})
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
        Meteor.call('DestroySpace', {spaceId: this.props.space._id}, (err, result) => {
            if (err) {
               this.handleError(err)
            }
            else {
                this.props.history.push('/space');
            }
        });
    }

    leaveSpace() {
        Meteor.call('LeaveSpace', {spaceId: this.props.space._id}, (err, result) => {
            if (err) {
                this.handleError(err)
            }
            else {
                this.props.history.push('/space');
            }
        });
    }

    confirmContributor(contributorId) {
        Meteor.call('ConfirmContributor', {spaceId: this.props.space._id, contributorId}, (err, result) => {
            if (err) {
                this.handleError(err)
            }
        });
    }

    confirmMaintainer(maintainerId) {
        Meteor.call('ConfirmMaintainer', {spaceId: this.props.space._id, maintainerId}, (err, result) => {
            if (err) {
                this.handleError(err)
            }
        });
    }

    removeContributor(contributorId) {
        Meteor.call('RemoveContributor', {spaceId: this.props.space._id, contributorId}, (err, result) => {
            if (err) {
                this.handleError(err)
            }
        });
    }

    removeMaintainer(maintainerId) {
        Meteor.call('RemoveMaintainer', {spaceId: this.props.space._id, maintainerId}, (err, result) => {
            if (err) {
                this.handleError(err)
            }
        });
    }

    joinSpace(role) {
        if (Meteor.userId()) {
            Meteor.call(`JoinSpaceAs${role}`, {spaceId: this.props.space._id}, (err, result) => {
                if (err) {
                    this.handleError(err)
                }
            });
        }
        else {
            alert('please login first...');
        }
    }

}

export default withRouter(SpaceDetail);