import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Activities from '../../../api/activities';
import ActivityDetail from './ActivityDetail';




const ActivityDetailContainer = withTracker(({match}) => {
    const spacesHandler = Meteor.subscribe('activities.detail', match.params.activityId);
    const loading = !spacesHandler.ready();
    const activity = Activities.findOne(match.params.activityId);

    return {
        loading,
        activity
    }
})(ActivityDetail);

export default ActivityDetailContainer;