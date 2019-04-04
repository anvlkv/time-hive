import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spaces from '../../../api/spaces';
import EventDetail from './EventDetail';
import Events from '../../../api/events';




const EventDetailContainer = withTracker(({match}) => {
    const eventsHandler = Meteor.subscribe('events.detail', match.params.eventId);
    const spaceHandler = Meteor.subscribe('spaces.my');
    const loading = !eventsHandler.ready() || !spaceHandler.ready();
    const event = Events.findOne(match.params.eventId);
    const space = Spaces.findOne(match.params.spaceId);

    return {
        loading,
        event,
        space
    }
})(EventDetail);

export default EventDetailContainer;