import { noop } from 'lodash/util';
import React from 'react';
import './ActivitiesList.scss';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Activities from '../../../api/activities';
import { BaseComponent } from '../base';

export default class ActivitiesList extends BaseComponent {
    static propTypes = {
        allActivities: PropTypes.array,
        selectedActivities: PropTypes.array,
        onActivityAdded: PropTypes.func,
        onActivityRemoved: PropTypes.func,
        onSelectionChange: PropTypes.func,
        editable: PropTypes.bool,
        selectable: PropTypes.bool,
        add: PropTypes.bool
    };

    state = {
        newActivityName: ''
    };

    constructor(props) {
        super(props);
    }

    renderActivity(activity) {
        return (
            <li key={`activity-list-item-${activity._id}`}>
                {this.maybeRenderSelectionControl(activity)}
                <div className={'dot'} style={{backgroundColor: activity.colorCode}}/>
                <ContentEditable html={activity.name}
                                 disabled={!this.props.editable}
                                 className={'activity-name'}
                                 onBlur={(e) => this.updateActivityName(e.target.innerText, activity)}/>
                {this.maybeRenderDeleteButton(activity)}
            </li>
        )
    }

    updateActivityName(name, activity) {
        if (name && activity.name !== name) {
            Activities.update(activity._id, {$set: {name}}, {}, (err) => {
                if(err) {
                    this.setState({});
                }
            });
        }

    }

    maybeRenderAddButton(){
        if (this.props.editable || this.props.add) {
            return (
                <li key={'add-activity-list-item'} className={'add-activity-list-item'}>
                    <input type="text" name="newActivityName" value={this.state.newActivityName} onChange={this.handleInputChange.bind(this)}/>
                    <button onClick={() => this.onAddButtonClick()}>Add</button>
                </li>
            )
        }
    }

    onAddButtonClick(name = this.state.newActivityName) {
        Activities.insert({name}, (err, result) => {
            if(err) {
                this.setState({});
            }
            else {
                this.props.onActivityAdded(result);
                this.setState({newActivityName: ''});
            }
        });
    }

    maybeRenderDeleteButton(activity){
        if (this.props.editable) {
            return (<button key={`remove-activity-${activity._id}`} onClick={() => this.onDeleteButtonClick(activity._id)}>X</button>)
        }
    }

    onDeleteButtonClick(activityId) {
        // console.log(this, activity);
        Activities.remove(activityId, (a, b) => {
            console.log(a, b);
        });
    }

    maybeRenderSelectionControl(activity) {
        if (this.props.selectable) {
            console.log(activity);
            return (
                <input type="checkbox"
                       checked={this.isActivitySelected(activity)}
                       onChange={this.onActivitySelectionChange.bind(this, activity)}/>
            )
        }
    }

    isActivitySelected(activity) {
        return !!(this.props.selectedActivities || []).find(a => a._id === activity._id);
    }

    onActivitySelectionChange(activity) {
        if (this.isActivitySelected(activity)) {
            const activityIndex = this.props.selectedActivities.findIndex(a => a._id === activity._id);
            (this.props.onSelectionChange || noop)(
                this.props.selectedActivities.slice(0, activityIndex).concat(
                    this.props.selectedActivities.slice(activityIndex + 1, this.props.selectedActivities.length)
                )
            )
        }
        else {
            (this.props.onSelectionChange || noop)(
                (this.props.selectedActivities || []).concat([activity])
            )
        }
    }

    render() {
        return (
            <ul className={'ActivitiesList'}>
                {this.props.allActivities.map(this.renderActivity.bind(this))}
                {this.maybeRenderAddButton()}
            </ul>
        );
    }
}
