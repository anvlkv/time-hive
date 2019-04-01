import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Activities from '../../../api/activities';
import Spaces from '../../../api/spaces';
import SpaceDetail from './SpaceDetail';




const SpaceDetailContainer = withTracker(({match}) => {
    const spacesHandler = Meteor.subscribe('spaces.detail', match.params.spaceId);
    const activitiesHandler = Meteor.subscribe('activities.my');
    const loading = !spacesHandler.ready() && !activitiesHandler.ready();
    const space = Spaces.findOne(match.params.spaceId);
    const activities = Activities.find({}, {sort: {name: 1}}).fetch();
    return {
        loading,
        space,
        activities
    }
})(SpaceDetail);

export default SpaceDetailContainer;