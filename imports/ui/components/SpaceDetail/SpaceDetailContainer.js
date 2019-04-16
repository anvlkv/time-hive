import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Activities from '../../../api/activities';
import Agreements from '../../../api/agreements';
import Events from '../../../api/events';
import Spaces from '../../../api/spaces';
import SpaceDetail from './SpaceDetail';




const SpaceDetailContainer = withTracker(({match}) => {
    const spacesHandler = Meteor.subscribe('spaces.detail', match.params.spaceId);
    const activitiesHandler = Meteor.subscribe('activities.my');
    const eventsHandler = Meteor.subscribe('events.my');
    const agreementsHandler = Meteor.subscribe('agreements.space', match.params.spaceId);
    const loading = !spacesHandler.ready() && !activitiesHandler.ready() && !eventsHandler.ready() && !agreementsHandler.ready();
    const space = Spaces.findOne(match.params.spaceId);
    const activities = Activities.find({}, {sort: {name: 1}}).fetch();
    const events = Events.find({}).fetch();
    const agreement = Agreements.findOne({});
    return {
        loading,
        space,
        activities,
        events,
        agreement
    }
})(SpaceDetail);

export default SpaceDetailContainer;