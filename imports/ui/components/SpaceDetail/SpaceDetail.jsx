import React from 'react';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Spaces from '../../../api/spaces';
import ActivitiesList from '../ActivitiesList/ActivitiesList';


export default class SpaceDetail extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        space: PropTypes.object,
        activities: PropTypes.array
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
                    <h2>{this.props.space.name}'s Activities</h2>
                    <ActivitiesList allActivities={this.props.space.activities}
                                    editable={true}
                                    onActivityAdded={this.onActivityAdded.bind(this)}
                                    onActivityRemoved={this.onActivityRemoved.bind(this)}/>
                </div>
            )
        }

    }

    onActivityAdded(activityId) {
        Meteor.call('AddActivityToSpace', {activityId, spaceId: this.props.space._id});
        // const space = this.props.space;
        // if (!space.activities.find(a => a._id === activityId)) {
        //     const activity = Activities.findOne({_id: activityId});
        //     Spaces.update({_id: space._id}, {$set: {activities: [...space.activities, activity]}});
        // }
    }

    onActivityRemoved(activityId) {
        console.log(activityId, this.props.space.activities.find(a => a._id === activityId));
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
                        }
                    });

                }
                break;
            case 'space-description-editor':
                if (event.target.children[0].className !== 'placeholder') {
                    Spaces.update(this.props.space._id, {$set:{description: event.target.innerHTML}}, {}, (err, result) => {
                        if (err || !result) {
                            this.setState(SpaceDetail.getDerivedStateFromProps(this.props, this.state));
                        }
                    })

                }
                break;
        }
    }


}